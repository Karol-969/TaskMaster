import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import type { BlogPost } from '@shared/schema';

export default function BlogPostPage() {
  const [match, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // Fetch blog post by slug
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${slug}`],
    enabled: !!slug,
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (!match) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{post.title} - ReArt Events Blog</title>
        <meta name="description" content={post.excerpt || `Read ${post.title} on ReArt Events blog`} />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative py-20">
          {post.imageUrl && (
            <div className="absolute inset-0 z-0">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Link href="/blog">
                <Button 
                  variant="outline" 
                  className="mb-6 border-gray-600 text-gray-300 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-center space-x-6 text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(post.publishedAt || post.createdAt || new Date())}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {estimateReadingTime(post.content)} min read
                </div>
                <Badge className="bg-purple-600 text-white">
                  Blog Post
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="prose prose-lg prose-invert max-w-none">
                <div 
                  className="text-gray-300 leading-relaxed"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {post.content}
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Share this post</h3>
                    <p className="text-gray-400">Help others discover this content</p>
                  </div>
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt || post.title,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-12 text-center">
                <Link href="/blog">
                  <Button 
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Read More Posts
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}