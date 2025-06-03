import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Volume2, Search, Filter } from 'lucide-react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
// import { SoundEquipmentModal } from '@/components/admin/sound-equipment-modal';
import { apiRequest } from '@/lib/queryClient';

interface SoundEquipment {
  id: number;
  name: string;
  type: string;
  description: string;
  specifications: string;
  pricing: string;
  powerRating: string;
  coverageArea: string;
  image: string;
  imageUrl: string;
  category: string;
  features: string[];
  available: boolean;
  createdAt: string;
}

export default function AdminSoundEquipmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<SoundEquipment | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery<SoundEquipment[]>({
    queryKey: ['/api/admin/sound-equipment'],
  });

  const categories = ['All', 'PA Systems', 'Mixers', 'Microphones', 'Monitors', 'Lighting', 'Accessories'];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/sound-equipment/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sound-equipment'] });
      toast({
        title: "Equipment Deleted",
        description: "Sound equipment has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete sound equipment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (equipment: SoundEquipment) => {
    setEditingEquipment(equipment);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingEquipment(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sound Equipment</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your sound equipment inventory</p>
          </div>
          <Button 
            onClick={() => setShowModal(true)} 
            className="bg-accent hover:bg-accent/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Search Equipment
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-accent text-black'
                          : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-300 dark:bg-slate-600 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : filteredEquipment.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Volume2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    No Equipment Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchTerm || selectedCategory !== 'All' 
                      ? 'Try adjusting your search or filter criteria' 
                      : 'Get started by adding your first piece of sound equipment'}
                  </p>
                  <Button 
                    onClick={() => setShowModal(true)}
                    className="bg-accent hover:bg-accent/90 text-black"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEquipment.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant={item.available ? "default" : "destructive"}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-accent text-black">
                            {item.pricing}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold group-hover:text-accent transition-colors">
                          {item.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Power:</span>
                            <span className="font-medium">{item.powerRating}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Coverage:</span>
                            <span className="font-medium">{item.coverageArea}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sound Equipment Modal will be implemented */}
    </AdminLayout>
  );
}