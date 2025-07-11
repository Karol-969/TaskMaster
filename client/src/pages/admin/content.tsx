import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Eye, FileText, Save, X, Upload, Image, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { BlogPost } from '@shared/schema';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  images: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}

export default function AdminContent() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    images: [],
    tags: [],
    status: 'published'
  });
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // File upload handler
  const handleFileUpload = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      return result.url;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  // Rich text formatting functions
  const insertFormatting = (format: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch (format) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        replacement = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'link':
        const url = value || prompt('Enter URL:') || '#';
        replacement = `[${selectedText || 'link text'}](${url})`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'quote text'}`;
        break;
      case 'list':
        replacement = selectedText ? selectedText.split('\n').map(line => `- ${line}`).join('\n') : '- List item';
        break;
      case 'ordered-list':
        replacement = selectedText ? selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n') : '1. List item';
        break;
      case 'heading1':
        replacement = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'heading2':
        replacement = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'heading3':
        replacement = `### ${selectedText || 'Heading 3'}`;
        break;
    }

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newValue }));
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  // Fetch blog posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog-posts'],
  });

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      return await apiRequest('POST', '/api/admin/blog-posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      setIsCreating(false);
      resetForm();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BlogFormData }) => {
      return await apiRequest('PUT', `/api/admin/blog-posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      setEditingPost(null);
      resetForm();
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      images: [],
      tags: [],
      status: 'published'
    });
    setNewTag('');
    setNewImage('');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage || '',
      images: post.images || [],
      tags: post.tags || [],
      status: post.status as 'draft' | 'published' | 'archived'
    });
    setIsCreating(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Content Management - ReArt Events Admin</title>
        <meta name="description" content="Manage blog posts and content for ReArt Events platform" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage blog posts and content</p>
          </div>
          <Button 
            onClick={() => {
              setIsCreating(true);
              setEditingPost(null);
              resetForm();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </div>

        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                  resetForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog post title"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the blog post"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' | 'archived' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-xs hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Additional Images</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Image URL"
                      onKeyPress={(e) => e.key === 'Enter' && addImage()}
                    />
                    <Button type="button" onClick={addImage} size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      disabled={uploadingImage}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await handleFileUpload(file);
                            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
                          } catch (error) {
                            // Error handled in handleFileUpload
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm flex-1 truncate">{image}</span>
                        <button
                          onClick={() => removeImage(image)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="content">Content *</Label>
              
              {/* Rich Text Editor Toolbar */}
              <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2">
                  <div className="flex flex-wrap gap-1">
                    {/* Text Formatting */}
                    <div className="flex gap-1 mr-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('bold')}
                        className="h-8 w-8 p-0"
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('italic')}
                        className="h-8 w-8 p-0"
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('underline')}
                        className="h-8 w-8 p-0"
                        title="Underline"
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Headings */}
                    <div className="flex gap-1 mr-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('heading1')}
                        className="h-8 px-2 text-xs font-bold"
                        title="Heading 1"
                      >
                        H1
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('heading2')}
                        className="h-8 px-2 text-xs font-bold"
                        title="Heading 2"
                      >
                        H2
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('heading3')}
                        className="h-8 px-2 text-xs font-bold"
                        title="Heading 3"
                      >
                        H3
                      </Button>
                    </div>

                    {/* Lists */}
                    <div className="flex gap-1 mr-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('list')}
                        className="h-8 w-8 p-0"
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('ordered-list')}
                        className="h-8 w-8 p-0"
                        title="Numbered List"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Other Formatting */}
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('quote')}
                        className="h-8 w-8 p-0"
                        title="Quote"
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('link')}
                        className="h-8 w-8 p-0"
                        title="Insert Link"
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Textarea
                  ref={textareaRef}
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here...

Use the toolbar above for formatting:
- **Bold text**
- *Italic text*
- # Heading 1
- ## Heading 2
- ### Heading 3
- > Quote
- [Link text](url)
- - Bullet list
- 1. Numbered list"
                  rows={15}
                  className="border-0 focus:ring-0 resize-none rounded-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid gap-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No blog posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                  Create your first blog post to get started with content management.
                </p>
                <Button 
                  onClick={() => {
                    setIsCreating(true);
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post: BlogPost) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {post.title}
                        </h3>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
                        {post.publishedAt && (
                          <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePostMutation.mutate(post.id)}
                        disabled={deletePostMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}