import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Image, Eye, Calendar, FileText } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPostsPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check authentication
  useState(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      setLocation('/admin/login');
      return;
    }
  });

  // Get all blog posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['/api/admin/blog-posts'],
  });

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest('/api/admin/blog-posts', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      setShowCreateDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await apiRequest(`/api/admin/blog-posts/${id}`, {
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      setShowEditDialog(false);
      setSelectedPost(null);
      resetForm();
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/blog-posts/${id}`, {
        method: 'DELETE',
      });
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
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      published: false
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('slug', generateSlug(formData.title));
    submitData.append('content', formData.content);
    submitData.append('excerpt', formData.excerpt);
    submitData.append('published', formData.published.toString());
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    if (selectedPost) {
      updatePostMutation.mutate({ id: selectedPost.id, data: submitData });
    } else {
      createPostMutation.mutate(submitData);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      published: post.published
    });
    setImagePreview(post.imageUrl);
    setShowEditDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deletePostMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Blog Posts Management - ReArt Events Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
            <p className="text-gray-400">Manage blog posts and articles</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="Brief description of the post"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="image" className="text-white">Featured Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                      />
                      <Label htmlFor="published" className="text-white">Publish immediately</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Write your blog post content here..."
                      rows={15}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateDialog(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={createPostMutation.isPending}
                  >
                    {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Blog Posts Table */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              All Blog Posts ({posts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading blog posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No blog posts found. Create your first post!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Published</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post: BlogPost) => (
                      <TableRow key={post.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {post.imageUrl && (
                              <img 
                                src={post.imageUrl} 
                                alt={post.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">{post.title}</p>
                              <p className="text-gray-400 text-sm">{post.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {formatDate(post.createdAt)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {post.publishedAt ? formatDate(post.publishedAt) : "Not published"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              className="text-gray-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(post)}
                              className="text-gray-300"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Blog Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title" className="text-white">Title *</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-excerpt" className="text-white">Excerpt</Label>
                    <Textarea
                      id="edit-excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-image" className="text-white">Featured Image</Label>
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                    <Label htmlFor="edit-published" className="text-white">Published</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-content" className="text-white">Content *</Label>
                  <Textarea
                    id="edit-content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Write your blog post content here..."
                    rows={15}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedPost(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={updatePostMutation.isPending}
                >
                  {updatePostMutation.isPending ? 'Updating...' : 'Update Post'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}