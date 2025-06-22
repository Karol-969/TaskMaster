import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerAd {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  position: string;
  pages: string[];
  isActive: boolean;
  priority: number;
}

interface BannerDisplayProps {
  position: 'header' | 'sidebar' | 'footer' | 'content-top' | 'content-bottom' | 'hero' | 'between-sections';
  page?: string;
  className?: string;
}

export function BannerDisplay({ position, page = 'home', className = '' }: BannerDisplayProps) {
  const [banners, setBanners] = useState<BannerAd[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, [position, page]);

  const fetchBanners = async () => {
    try {
      const params = new URLSearchParams({
        position,
        page
      });
      
      const response = await fetch(`/api/banner-ads?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
        
        // Track impressions for visible banners
        data.forEach((banner: BannerAd) => {
          trackImpression(banner.id);
        });
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (bannerId: number) => {
    try {
      await fetch(`/api/banner-ads/${bannerId}/impression`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async (bannerId: number) => {
    try {
      await fetch(`/api/banner-ads/${bannerId}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleBannerClick = (banner: BannerAd) => {
    trackClick(banner.id);
    if (banner.linkUrl) {
      window.open(banner.linkUrl, '_blank');
    }
  };

  const dismissBanner = (bannerId: number) => {
    setDismissedBanners(prev => new Set(prev).add(bannerId));
  };

  const visibleBanners = banners.filter(banner => !dismissedBanners.has(banner.id));

  if (loading || visibleBanners.length === 0) {
    return null;
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'header':
        return 'w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4';
      case 'sidebar':
        return 'w-full max-w-xs bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4';
      case 'footer':
        return 'w-full bg-gray-800 text-white py-4 px-4';
      case 'content-top':
        return 'w-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 mb-6';
      case 'content-bottom':
        return 'w-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-lg p-4 mt-6';
      case 'hero':
        return 'absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm text-white rounded-lg p-3';
      case 'between-sections':
        return 'w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 my-8';
      default:
        return 'w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4';
    }
  };

  return (
    <div className={`${className}`}>
      <AnimatePresence>
        {visibleBanners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${getPositionStyles()} ${banner.linkUrl ? 'cursor-pointer hover:opacity-90' : ''} relative group`}
            onClick={() => banner.linkUrl && handleBannerClick(banner)}
          >
            {/* Dismiss button for user-dismissible banners */}
            {['sidebar', 'content-top', 'content-bottom', 'between-sections'].includes(position) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissBanner(banner.id);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center space-x-4">
              {banner.imageUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className={`object-cover rounded ${
                      position === 'header' ? 'w-8 h-8' :
                      position === 'sidebar' ? 'w-16 h-16' :
                      position === 'hero' ? 'w-12 h-12' :
                      'w-20 h-20'
                    }`}
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${
                  position === 'header' ? 'text-sm' :
                  position === 'sidebar' ? 'text-base' :
                  'text-lg'
                } truncate`}>
                  {banner.title}
                </h3>
                
                {banner.description && ['sidebar', 'content-top', 'content-bottom', 'between-sections'].includes(position) && (
                  <p className={`mt-1 ${
                    position === 'sidebar' ? 'text-sm text-gray-400' :
                    'text-sm text-gray-600 dark:text-gray-300'
                  }`}>
                    {banner.description}
                  </p>
                )}

                {banner.linkUrl && ['sidebar', 'between-sections'].includes(position) && (
                  <div className="mt-2">
                    <span className="text-xs text-purple-400 hover:text-purple-300">
                      Learn More →
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Header banner compact layout */}
            {position === 'header' && (
              <div className="text-xs opacity-90">
                {banner.description || 'Click to learn more'}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default BannerDisplay;