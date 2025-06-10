import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import type { BlogPost } from '@shared/schema';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts', slug],
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

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-300 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-600/30 rounded w-1/4"></div>
              <div className="h-64 bg-gray-600/30 rounded"></div>
              <div className="h-12 bg-gray-600/30 rounded w-3/4"></div>
              <div className="h-4 bg-gray-600/30 rounded w-1/2"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-600/30 rounded"></div>
                <div className="h-4 bg-gray-600/30 rounded"></div>
                <div className="h-4 bg-gray-600/30 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-6">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Link href="/blog">
            <Button 
              variant="ghost" 
              className="text-purple-400 hover:text-purple-300 hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt || new Date())}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(post.content.length / 1000)} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>ReArt Events Team</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="text-xl text-gray-300 leading-relaxed mb-8 p-6 bg-white/5 rounded-lg border-l-4 border-purple-600">
                {post.excerpt}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-lg leading-relaxed">
                {formatContent(post.content)}
              </div>
            </div>

            {/* Additional Images */}
            {post.images && post.images.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-white mb-6">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((image, index) => (
                    <div key={index} className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${post.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </article>

        {/* Related/Navigation */}
        <div className="bg-white/5 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Interested in Our Services?
            </h3>
            <p className="text-gray-300 mb-8">
              Contact us to learn more about our event management and booking services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Contact Us
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/10">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}