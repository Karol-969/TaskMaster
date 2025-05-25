import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Ticket, Users, Calendar, DollarSign } from 'lucide-react';

export function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/bookings'],
  });

  const filteredBookings = (bookings as any[]).filter((booking: any) => {
    const matchesSearch = booking.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const bookingStats = {
    total: (bookings as any[]).length,
    confirmed: (bookings as any[]).filter(b => b.status === 'confirmed').length,
    pending: (bookings as any[]).filter(b => b.status === 'pending').length,
    cancelled: (bookings as any[]).filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
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
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-white">{bookingStats.confirmed}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{bookingStats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Cancelled</p>
                <p className="text-2xl font-bold text-white">{bookingStats.cancelled}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Management */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-xl">Bookings Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Table */}
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-gray-300">Booking ID</TableHead>
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Event</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => (
                  <TableRow key={booking.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-white font-medium">#{booking.id}</TableCell>
                    <TableCell className="text-gray-300">User #{booking.userId}</TableCell>
                    <TableCell className="text-gray-300">Event #{booking.eventId}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'default' : 
                          booking.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}