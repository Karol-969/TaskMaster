import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Ticket, Search, Calendar, User, DollarSign, CheckCircle, Clock, XCircle, Eye, Edit, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/bookings'],
  });

  const updateBookingMutation = useMutation({
    mutationFn: async (data: { id: number; status: string }) => {
      const response = await fetch(`/api/bookings/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: data.status }),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({ title: 'Booking updated successfully' });
    },
  });

  const getBookingStatus = (booking: any) => {
    const status = booking.status || 'pending';
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle };
      case 'cancelled':
        return { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle };
      case 'pending':
        return { label: 'Pending', variant: 'secondary' as const, icon: Clock };
      default:
        return { label: 'Unknown', variant: 'secondary' as const, icon: Clock };
    }
  };

  const filteredBookings = (bookings as any[]).filter((booking: any) => {
    const matchesSearch = booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const bookingStats = {
    total: (bookings as any[]).length,
    confirmed: (bookings as any[]).filter(b => b.status === 'confirmed').length,
    pending: (bookings as any[]).filter(b => b.status === 'pending').length,
    cancelled: (bookings as any[]).filter(b => b.status === 'cancelled').length,
    totalRevenue: (bookings as any[])
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    updateBookingMutation.mutate({ id: bookingId, status: newStatus });
  };

  const toggleBookingSelection = (bookingId: number) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleAllBookings = () => {
    setSelectedBookings(
      selectedBookings.length === filteredBookings.length 
        ? [] 
        : filteredBookings.map(booking => booking.id)
    );
  };

  const handleBulkStatusUpdate = (status: string) => {
    if (selectedBookings.length === 0) return;
    if (confirm(`Are you sure you want to ${status} ${selectedBookings.length} bookings?`)) {
      selectedBookings.forEach(id => updateBookingMutation.mutate({ id, status }));
      setSelectedBookings([]);
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
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookingStats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-white">{bookingStats.confirmed}</p>
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
                <p className="text-2xl font-bold text-white">{bookingStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Cancelled</p>
                <p className="text-2xl font-bold text-white">{bookingStats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">${bookingStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Management */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">Booking Management</CardTitle>
            <Button variant="outline" className="border-slate-700">
              <Download className="h-4 w-4 mr-2" />
              Export Bookings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Bulk Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedBookings.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">{selectedBookings.length} selected</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleBulkStatusUpdate('confirmed')}
                  className="border-green-600 text-green-400 hover:bg-green-600/10"
                >
                  Confirm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleBulkStatusUpdate('cancelled')}
                  className="border-red-600 text-red-400 hover:bg-red-600/10"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Bookings Table */}
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                      onCheckedChange={toggleAllBookings}
                    />
                  </TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Event</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => {
                  const status = getBookingStatus(booking);
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={booking.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={() => toggleBookingSelection(booking.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{booking.customerName || 'Unknown Customer'}</div>
                            <div className="text-sm text-gray-400">{booking.customerEmail || 'No email'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{booking.eventName || 'Event Name'}</div>
                          <div className="text-sm text-gray-400">{booking.eventVenue || 'Venue'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-white">
                            {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'TBD'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white font-medium">
                          ${(booking.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {booking.ticketQuantity || 1} ticket(s)
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="flex items-center space-x-1 w-fit">
                          <StatusIcon className="h-3 w-3" />
                          <span>{status.label}</span>
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
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                className="border-green-600 text-green-400 hover:bg-green-600/10"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                className="border-red-600 text-red-400 hover:bg-red-600/10"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
    </div>
  );
}