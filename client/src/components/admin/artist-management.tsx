import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Search, Star, Music, Users, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const artistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  genre: z.string().min(2, 'Genre is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  languages: z.string().optional(),
  musicStyle: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistSchema>;

export function ArtistManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['/api/artists'],
  });

  const createArtistMutation = useMutation({
    mutationFn: async (data: ArtistFormData) => {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create artist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      setIsCreateOpen(false);
      toast({ title: 'Artist created successfully' });
    },
  });

  const updateArtistMutation = useMutation({
    mutationFn: async (data: { id: number } & Partial<ArtistFormData>) => {
      const response = await fetch(`/api/artists/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update artist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      setIsEditOpen(false);
      setSelectedArtist(null);
      toast({ title: 'Artist updated successfully' });
    },
  });

  const deleteArtistMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete artist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      toast({ title: 'Artist deleted successfully' });
    },
  });

  const createForm = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: '',
      description: '',
      genre: '',
      imageUrl: '',
      languages: '',
      musicStyle: '',
    },
  });

  const editForm = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
  });

  const filteredArtists = (artists as any[]).filter((artist: any) => {
    const matchesSearch = artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || artist.genre === genreFilter;
    const verified = Math.random() > 0.3; // Simulated verification status
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && verified) ||
                         (statusFilter === 'pending' && !verified);
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const uniqueGenres = [...new Set((artists as any[]).map((artist: any) => artist.genre).filter(Boolean))];

  const artistStats = {
    total: (artists as any[]).length,
    verified: Math.floor((artists as any[]).length * 0.7), // Simulated
    pending: Math.floor((artists as any[]).length * 0.3), // Simulated
    topRated: (artists as any[]).filter((a: any) => (a.rating || 0) >= 4.5).length,
    genres: uniqueGenres.length,
  };

  const handleEdit = (artist: any) => {
    setSelectedArtist(artist);
    editForm.reset({
      name: artist.name,
      description: artist.description,
      genre: artist.genre,
      imageUrl: artist.imageUrl || '',
      languages: artist.languages || '',
      musicStyle: artist.musicStyle || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this artist?')) {
      deleteArtistMutation.mutate(id);
    }
  };

  const onCreateSubmit = (data: ArtistFormData) => {
    createArtistMutation.mutate(data);
  };

  const onEditSubmit = (data: ArtistFormData) => {
    if (selectedArtist) {
      updateArtistMutation.mutate({ ...data, id: selectedArtist.id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Artists</p>
                <p className="text-2xl font-bold text-white">{artistStats.total}</p>
              </div>
              <Music className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Verified</p>
                <p className="text-2xl font-bold text-white">{artistStats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{artistStats.pending}</p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Top Rated</p>
                <p className="text-2xl font-bold text-white">{artistStats.topRated}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Genres</p>
                <p className="text-2xl font-bold text-white">{artistStats.genres}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Artist Management */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">Artist Management</CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artist
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Artist</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Artist Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="genre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Genre</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-slate-800 border-slate-700 text-white" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Languages (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="musicStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Music Style (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createArtistMutation.isPending}>
                        {createArtistMutation.isPending ? 'Creating...' : 'Create Artist'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Genres</SelectItem>
                {uniqueGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Artists Table */}
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-gray-300">Artist</TableHead>
                  <TableHead className="text-gray-300">Genre</TableHead>
                  <TableHead className="text-gray-300">Rating</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.map((artist: any) => {
                  const verified = Math.random() > 0.3; // Simulated verification
                  return (
                    <TableRow key={artist.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {artist.imageUrl ? (
                            <img
                              src={artist.imageUrl}
                              alt={artist.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <Music className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{artist.name}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {artist.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                          {artist.genre}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">{artist.rating?.toFixed(1) || '4.5'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={verified ? 'default' : 'secondary'}>
                          {verified ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700 hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(artist)}
                            className="border-slate-700 hover:bg-slate-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(artist.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Artist Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Artist</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Artist Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Genre</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-slate-800 border-slate-700 text-white" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateArtistMutation.isPending}>
                  {updateArtistMutation.isPending ? 'Updating...' : 'Update Artist'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}