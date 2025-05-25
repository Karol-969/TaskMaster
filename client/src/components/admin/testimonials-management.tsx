import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Star, MessageSquare, Users, ThumbsUp } from 'lucide-react';

export function TestimonialsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const { data: testimonials = [] } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  const filteredTestimonials = (testimonials as any[]).filter((testimonial: any) => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || testimonial.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const testimonialStats = {
    total: (testimonials as any[]).length,
    avgRating: (testimonials as any[]).length > 0 
      ? (testimonials as any[]).reduce((sum, t) => sum + t.rating, 0) / (testimonials as any[]).length
      : 0,
    fiveStars: (testimonials as any[]).filter(t => t.rating === 5).length,
    recent: (testimonials as any[]).filter((t: any) => {
      const testDate = new Date(t.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return testDate > weekAgo;
    }).length,
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Reviews</p>
                <p className="text-2xl font-bold text-white">{testimonialStats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-white">{testimonialStats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">5-Star Reviews</p>
                <p className="text-2xl font-bold text-white">{testimonialStats.fiveStars}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">{testimonialStats.recent}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Management */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-xl">Customer Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Testimonials Table */}
          <div className="rounded-lg border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Review</TableHead>
                  <TableHead className="text-gray-300">Rating</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTestimonials.map((testimonial: any) => (
                  <TableRow key={testimonial.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300 max-w-md">
                        <p className="line-clamp-2">{testimonial.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(testimonial.rating)}
                        <span className="text-white ml-2">{testimonial.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
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