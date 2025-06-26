import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Phone, Mail, Clock, CreditCard, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SoundSystem {
  id: number;
  name: string;
  type: string;
  description: string;
  specifications: string;
  pricing: string;
  powerRating: string;
  coverageArea: string;
  imageUrl: string;
  category: string;
  features: string[];
  available: boolean;
}

interface IndividualEquipmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: SoundSystem | null;
}

export function IndividualEquipmentBookingModal({ 
  isOpen, 
  onClose, 
  equipment 
}: IndividualEquipmentBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    venueName: '',
    venueAddress: '',
    expectedAttendance: '',
    contactName: '',
    email: '',
    phone: '',
    quantity: 1,
    rentalDays: 1,
    specialRequirements: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    if (!equipment) return 0;
    const priceMatch = equipment.pricing.match(/NPR\s*([\d,]+)/);
    const dailyPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
    return dailyPrice * formData.quantity * formData.rentalDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipment) return;

    // Basic validation
    if (!formData.contactName || !formData.email || !formData.phone || !formData.eventName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const totalAmount = calculateTotal();

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: Date.now(),
          amount: totalAmount,
          productName: `${equipment.name} x${formData.quantity} (${formData.rentalDays} days)`,
          customerInfo: {
            name: formData.contactName,
            email: formData.email,
            phone: formData.phone
          },
          bookingData: {
            ...formData,
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            equipmentCategory: equipment.category,
            totalAmount
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          throw new Error('Payment URL not received');
        }
      } else {
        throw new Error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Volume2 className="h-6 w-6 text-purple-400" />
            Book {equipment.name}
          </DialogTitle>
          <p className="text-gray-400 mt-2">
            Book this individual equipment item for your event. Specify quantity and rental duration.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Equipment Details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-0">
                <h3 className="text-lg font-semibold text-white mb-4">Equipment Details</h3>
                
                <div className="space-y-4">
                  <img 
                    src={equipment.imageUrl} 
                    alt={equipment.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">{equipment.name}</h4>
                    <Badge className="mb-3">{equipment.category}</Badge>
                    <p className="text-gray-400 text-sm mb-3">{equipment.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      {equipment.powerRating && equipment.powerRating !== 'N/A' && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Power:</span>
                          <span className="text-white">{equipment.powerRating}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coverage:</span>
                        <span className="text-white">{equipment.coverageArea}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Rate:</span>
                        <span className="text-purple-400 font-bold">{equipment.pricing}</span>
                      </div>
                    </div>

                    {equipment.features && equipment.features.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-white mb-2">Features:</h5>
                        <div className="flex flex-wrap gap-1">
                          {equipment.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Event Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                    <Input
                      placeholder="Your event name"
                      value={formData.eventName}
                      onChange={(e) => handleInputChange('eventName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event Date *</label>
                    <Input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Venue Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  Venue Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Venue Name</label>
                    <Input
                      placeholder="Venue or location name"
                      value={formData.venueName}
                      onChange={(e) => handleInputChange('venueName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expected Attendance</label>
                    <Input
                      type="number"
                      placeholder="Number of attendees"
                      value={formData.expectedAttendance}
                      onChange={(e) => handleInputChange('expectedAttendance', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue Address</label>
                  <Textarea
                    placeholder="Full venue address"
                    value={formData.venueAddress}
                    onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    rows={2}
                  />
                </div>
              </div>

              {/* Rental Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Rental Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rental Days</label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.rentalDays}
                      onChange={(e) => handleInputChange('rentalDays', parseInt(e.target.value) || 1)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Name *</label>
                    <Input
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                    <Input
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Special Requirements</label>
                <Textarea
                  placeholder="Any specific setup requirements or additional notes..."
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              {/* Cost Summary */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  Cost Summary
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Rate:</span>
                    <span className="text-white">{equipment.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rental Days:</span>
                    <span className="text-white">{formData.rentalDays}</span>
                  </div>
                  <hr className="border-gray-600 my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total Amount:</span>
                    <span className="text-purple-400">NPR {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 py-3"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Book & Pay Now - NPR ${calculateTotal().toLocaleString()}`}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}