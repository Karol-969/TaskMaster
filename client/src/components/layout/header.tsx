import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { useAuth } from '@/providers/auth-provider';
import { useAuth as useAuthActions } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuthActions();
  const { toast } = useToast();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Artists', href: '/artists' },
    { label: 'Sound', href: '/sound' },
    { label: 'Services', href: '/services' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to logout",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-purple-500/20' : 'bg-background'
    }`}>
      <div className="container mx-auto px-4 h-16">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-purple-500 purple-text-glow">Reart</span>
              <span className="text-xl font-medium text-foreground">Events</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                  location === item.href ? 'text-purple-500' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Theme Toggle Only */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <ThemeToggle className="mr-2" />
            <MobileMenu items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
