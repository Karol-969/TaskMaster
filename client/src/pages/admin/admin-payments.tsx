import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Search, Filter, Download, Eye, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  khaltiTransactionId: string | null;
  customerName: string;
  customerEmail: string;
  productName: string;
  createdAt: string;
  paymentDate: string | null;
}

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  const { data: payments = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/payments'],
  });

  const paymentsArray = Array.isArray(payments) ? payments as Payment[] : [];

  const formatNPR = (amount: number, inPaisa: boolean = true) => {
    const nprAmount = inPaisa ? amount / 100 : amount;
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(nprAmount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'failed':
        return 'bg-red-600';
      case 'refunded':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredPayments = paymentsArray.filter((payment: Payment) => {
    const matchesSearch = !searchTerm || 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.khaltiTransactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || payment.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const totalRevenue = payments
    .filter((p: Payment) => p.status === 'completed')
    .reduce((sum: number, p: Payment) => sum + p.amount, 0);

  const pendingPayments = payments.filter((p: Payment) => p.status === 'pending').length;
  const completedPayments = payments.filter((p: Payment) => p.status === 'completed').length;
  const failedPayments = payments.filter((p: Payment) => p.status === 'failed').length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Payment Management | Admin Dashboard</title>
        <meta name="description" content="Manage and monitor payment transactions, revenue, and Khalti gateway integration." />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Payment Management</h1>
            <p className="text-gray-400 mt-2">Monitor transactions and revenue from Khalti payments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outline" className="border-gray-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" className="border-gray-600">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNPR(totalRevenue)}</div>
              <p className="text-xs text-gray-400">From completed payments</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedPayments}</div>
              <p className="text-xs text-gray-400">Successful transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending</CardTitle>
              <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pendingPayments}</div>
              <p className="text-xs text-gray-400">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Failed</CardTitle>
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{failedPayments}</div>
              <p className="text-xs text-gray-400">Failed transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer, email, product, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="khalti">Khalti</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Payment Transactions</CardTitle>
            <p className="text-gray-400">
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Payment ID</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Product</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Method</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment: Payment) => (
                    <TableRow key={payment.id} className="border-gray-700">
                      <TableCell className="text-white font-mono">#{payment.id}</TableCell>
                      <TableCell>
                        <div className="text-white">
                          <div className="font-medium">{payment.customerName}</div>
                          <div className="text-sm text-gray-400">{payment.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{payment.productName}</TableCell>
                      <TableCell className="text-white font-semibold">
                        {formatNPR(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(payment.status)} text-white`}>
                          {payment.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white capitalize">{payment.paymentMethod}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="text-sm">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(payment.createdAt), 'hh:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No payments found</h3>
                <p className="text-gray-400">
                  {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No payment transactions have been recorded yet.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}