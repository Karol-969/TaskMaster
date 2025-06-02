import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const soundEquipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  type: z.string().min(1, 'Equipment type is required'),
  description: z.string().min(1, 'Description is required'),
  specifications: z.string().min(1, 'Specifications are required'),
  pricing: z.string().min(1, 'Pricing is required'),
  powerRating: z.string().min(1, 'Power rating is required'),
  coverageArea: z.string().min(1, 'Coverage area is required'),
  category: z.string().min(1, 'Category is required'),
  available: z.boolean(),
});

type SoundEquipmentFormData = z.infer<typeof soundEquipmentSchema>;

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
  category: string;
  features: string[];
  available: boolean;
  createdAt: string;
}

interface SoundEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: SoundEquipment | null;
}

export function SoundEquipmentModal({ isOpen, onClose, equipment }: SoundEquipmentModalProps) {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SoundEquipmentFormData>({
    resolver: zodResolver(soundEquipmentSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      specifications: '',
      pricing: '',
      powerRating: '',
      coverageArea: '',
      category: 'PA Systems',
      available: true,
    },
  });

  useEffect(() => {
    if (equipment) {
      form.reset({
        name: equipment.name,
        type: equipment.type,
        description: equipment.description,
        specifications: equipment.specifications,
        pricing: equipment.pricing,
        powerRating: equipment.powerRating,
        coverageArea: equipment.coverageArea,
        category: equipment.category,
        available: equipment.available,
      });
      setImageBase64(equipment.image || '');
      setFeatures(equipment.features || []);
    } else {
      form.reset({
        name: '',
        type: '',
        description: '',
        specifications: '',
        pricing: '',
        powerRating: '',
        coverageArea: '',
        category: 'PA Systems',
        available: true,
      });
      setImageBase64('');
      setFeatures([]);
    }
  }, [equipment, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: SoundEquipmentFormData) => {
      const payload = {
        ...data,
        image: imageBase64,
        features: features,
      };

      if (equipment) {
        await apiRequest(`/api/admin/sound-equipment/${equipment.id}`, 'PUT', payload);
      } else {
        await apiRequest('/api/admin/sound-equipment', 'POST', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sound-equipment'] });
      toast({
        title: equipment ? "Equipment Updated" : "Equipment Added",
        description: `Sound equipment has been successfully ${equipment ? 'updated' : 'added'}.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save sound equipment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = (data: SoundEquipmentFormData) => {
    saveMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {equipment ? 'Edit Equipment' : 'Add Sound Equipment'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter equipment name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter equipment type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PA Systems">PA Systems</SelectItem>
                            <SelectItem value="Mixers">Mixers</SelectItem>
                            <SelectItem value="Microphones">Microphones</SelectItem>
                            <SelectItem value="Monitors">Monitors</SelectItem>
                            <SelectItem value="Lighting">Lighting</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pricing</FormLabel>
                        <FormControl>
                          <Input placeholder="NPR 5,000/day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="powerRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power Rating</FormLabel>
                        <FormControl>
                          <Input placeholder="1000W" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverageArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Area</FormLabel>
                        <FormControl>
                          <Input placeholder="500 people" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter equipment description"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Specifications</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter technical specifications"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Features Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Features
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded px-2 py-1 text-sm">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    {imageBase64 ? (
                      <div className="relative">
                        <img
                          src={imageBase64}
                          alt="Equipment preview"
                          className="w-full h-48 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setImageBase64('')}
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Click to upload equipment image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button type="button" variant="outline" asChild>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            Choose Image
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Available for booking</FormLabel>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Mark as available for customer bookings
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="flex justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={saveMutation.isPending}
              className="bg-accent hover:bg-accent/90 text-black"
            >
              {saveMutation.isPending ? 'Saving...' : equipment ? 'Update Equipment' : 'Add Equipment'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}