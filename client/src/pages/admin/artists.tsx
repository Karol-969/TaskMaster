import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Music, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Play
} from 'lucide-react';
import type { Artist } from '@shared/schema';

export default function AdminArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for new/edit artist
  const [artistForm, setArtistForm] = useState({
    name: '',
    genre: '',
    description: '',
    imageUrl: '',
    location: '',
    contactEmail: '',
    phone: '',
    bio: '',
    languages: '',
    musicStyle: '',
    availability: true
  });

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Image compression function
  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Fetch all artists using bypass route
  const { data: artists = [], isLoading } = useQuery<Artist[]>({
    queryKey: ['/api/artists-admin-bypass'],
  });

  // Create artist mutation
  const createArtistMutation = useMutation({
    mutationFn: async (artistData: typeof artistForm) => {
      const response = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artistData)
      });
      if (!response.ok) throw new Error('Failed to create artist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists-admin-bypass'] });
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] }); // Also invalidate public artists
      setIsCreateDialogOpen(false);
      resetForm();
      setImagePreview('');
      setSelectedImage(null);
      toast({
        title: "Artist created successfully",
        description: "The new artist has been added to the platform.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating artist",
        description: error.message || "Failed to create artist",
        variant: "destructive",
      });
    }
  });

  // Update artist mutation
  const updateArtistMutation = useMutation({
    mutationFn: async ({ id, artistData }: { id: number; artistData: Partial<typeof artistForm> }) => {
      const response = await fetch(`/api/admin/artists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artistData)
      });
      if (!response.ok) throw new Error('Failed to update artist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/artists'] });
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] }); // Also invalidate public artists
      setIsEditDialogOpen(false);
      setSelectedArtist(null);
      resetForm();
      toast({
        title: "Artist updated successfully",
        description: "The artist information has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating artist",
        description: error.message || "Failed to update artist",
        variant: "destructive",
      });
    }
  });

  // Delete artist mutation
  const deleteArtistMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/artists/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete artist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/artists'] });
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] }); // Also invalidate public artists
      toast({
        title: "Artist deleted successfully",
        description: "The artist has been removed from the platform.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting artist",
        description: error.message || "Failed to delete artist",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setArtistForm({
      name: '',
      genre: '',
      description: '',
      imageUrl: '',
      location: '',
      contact: '',
      email: '',
      phone: '',
      rate: '',
      experience: '',
      specialties: '',
      languages: '',
      musicStyle: '',
      socialMedia: '',
      website: '',
      availability: 'available'
    });
  };

  const handleEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setArtistForm({
      name: artist.name,
      genre: artist.genre || '',
      bio: artist.bio || '',
      location: artist.location || '',
      contact: artist.contact || '',
      email: artist.email || '',
      phone: artist.phone || '',
      rate: artist.rate?.toString() || '',
      experience: artist.experience || '',
      specialties: artist.specialties || '',
      availability: (artist.availability as any) || 'available'
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (artistId: number) => {
    if (window.confirm('Are you sure you want to delete this artist? This will remove them from the public listings.')) {
      deleteArtistMutation.mutate(artistId);
    }
  };

  // Filter artists based on search and genre
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === 'all' || artist.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const getAvailabilityBadgeColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'unavailable': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const uniqueGenres = [...new Set(artists.map(a => a.genre).filter(Boolean))];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artist Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage platform artists, their profiles, and availability
            </p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add New Artist
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artists.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {artists.filter(a => a.availability === 'available').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Busy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {artists.filter(a => a.availability === 'busy').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueGenres.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Artists List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Artists List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={filterGenre} onValueChange={setFilterGenre}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {uniqueGenres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artist</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{artist.name}</div>
                            <div className="text-sm text-gray-500">{artist.genre}</div>
                            {artist.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <MapPin className="w-3 h-3" />
                                {artist.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {artist.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3" />
                              {artist.email}
                            </div>
                          )}
                          {artist.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3" />
                              {artist.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {artist.rate && (
                          <div className="flex items-center gap-1 font-medium">
                            <DollarSign className="w-3 h-3" />
                            {artist.rate}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getAvailabilityBadgeColor(artist.availability || 'available')}>
                          {artist.availability || 'available'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(artist)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(artist.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Artist Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Artist</DialogTitle>
              <DialogDescription>
                Create a new artist profile for the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  value={artistForm.name}
                  onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                  placeholder="Enter artist name"
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={artistForm.genre}
                  onChange={(e) => setArtistForm({ ...artistForm, genre: e.target.value })}
                  placeholder="e.g. Jazz, Rock, Pop"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={artistForm.email}
                  onChange={(e) => setArtistForm({ ...artistForm, email: e.target.value })}
                  placeholder="artist@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={artistForm.phone}
                  onChange={(e) => setArtistForm({ ...artistForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={artistForm.location}
                  onChange={(e) => setArtistForm({ ...artistForm, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="image">Artist Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      try {
                        // Compress the image to reduce size
                        const compressedImage = await compressImage(file);
                        setImagePreview(compressedImage);
                        setArtistForm({ ...artistForm, imageUrl: compressedImage });
                      } catch (error) {
                        console.error('Error compressing image:', error);
                        // Fallback to original file
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          setImagePreview(result);
                          setArtistForm({ ...artistForm, imageUrl: result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select value={artistForm.availability} onValueChange={(value: any) => setArtistForm({ ...artistForm, availability: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={artistForm.experience}
                  onChange={(e) => setArtistForm({ ...artistForm, experience: e.target.value })}
                  placeholder="5+ years"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={artistForm.bio}
                  onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
                  placeholder="Artist biography and description"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="specialties">Specialties</Label>
                <Input
                  id="specialties"
                  value={artistForm.specialties}
                  onChange={(e) => setArtistForm({ ...artistForm, specialties: e.target.value })}
                  placeholder="Wedding music, Corporate events, Concerts"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createArtistMutation.mutate(artistForm)}
                disabled={createArtistMutation.isPending}
              >
                {createArtistMutation.isPending ? 'Creating...' : 'Create Artist'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Artist Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Artist</DialogTitle>
              <DialogDescription>
                Update artist profile information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Artist Name</Label>
                <Input
                  id="edit-name"
                  value={artistForm.name}
                  onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                  placeholder="Enter artist name"
                />
              </div>
              <div>
                <Label htmlFor="edit-genre">Genre</Label>
                <Input
                  id="edit-genre"
                  value={artistForm.genre}
                  onChange={(e) => setArtistForm({ ...artistForm, genre: e.target.value })}
                  placeholder="e.g. Jazz, Rock, Pop"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={artistForm.email}
                  onChange={(e) => setArtistForm({ ...artistForm, email: e.target.value })}
                  placeholder="artist@example.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={artistForm.phone}
                  onChange={(e) => setArtistForm({ ...artistForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={artistForm.location}
                  onChange={(e) => setArtistForm({ ...artistForm, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={artistForm.price}
                  onChange={(e) => setArtistForm({ ...artistForm, price: e.target.value })}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label htmlFor="edit-availability">Availability</Label>
                <Select value={artistForm.availability} onValueChange={(value: any) => setArtistForm({ ...artistForm, availability: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-experience">Experience</Label>
                <Input
                  id="edit-experience"
                  value={artistForm.experience}
                  onChange={(e) => setArtistForm({ ...artistForm, experience: e.target.value })}
                  placeholder="5+ years"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea
                  id="edit-bio"
                  value={artistForm.bio}
                  onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
                  placeholder="Artist biography and description"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-specialties">Specialties</Label>
                <Input
                  id="edit-specialties"
                  value={artistForm.specialties}
                  onChange={(e) => setArtistForm({ ...artistForm, specialties: e.target.value })}
                  placeholder="Wedding music, Corporate events, Concerts"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedArtist && updateArtistMutation.mutate({ 
                  id: selectedArtist.id, 
                  artistData: artistForm 
                })}
                disabled={updateArtistMutation.isPending}
              >
                {updateArtistMutation.isPending ? 'Updating...' : 'Update Artist'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}