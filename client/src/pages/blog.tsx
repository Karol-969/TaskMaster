import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag, Search, FileText, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch published blog posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  // Filter posts based on search
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <Helmet>
        <title>Blog - ReArt Events</title>
        <meta name="description" content="Stay updated with the latest news, insights, and stories from ReArt Events. Discover event management tips, industry trends, and behind-the-scenes content." />
        <meta property="og:title" content="Blog - ReArt Events" />
        <meta property="og:description" content="Stay updated with the latest news, insights, and stories from ReArt Events." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Blog</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Stay updated with the latest news, insights, and stories from the world of event management and entertainment.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  onClick={() => setSelectedTag(null)}
                  className={selectedTag === null ? 
                    "bg-purple-600 hover:bg-purple-700 text-white" : 
                    "border-gray-600 text-gray-300 hover:bg-white/10"
                  }
                >
                  All
                </Button>
                {/* Tag functionality can be added later */}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <div className="animate-pulse space-y-4">
                      <div className="h-48 bg-gray-600/30 rounded"></div>
                      <div className="h-4 bg-gray-600/30 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-600/30 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-600/30 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {posts.length === 0 ? 'No blog posts yet' : 'No posts found'}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {posts.length === 0 
                    ? 'Stay tuned for exciting content coming soon!' 
                    : 'Try adjusting your search terms or removing filters.'
                  }
                </p>
                {searchTerm || selectedTag ? (
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag(null);
                    }}
                    className="mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPosts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <Card className="bg-white/10 border-gray-700 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 h-full">
                      {post.imageUrl && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt || post.createdAt || new Date())}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{Math.ceil(post.content.length / 1000)} min read</span>
                        </div>
                        <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                              >
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        <Link href={`/blog/${post.slug}`}>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            Read More
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}