import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KhaltiPaymentButton } from '@/components/payment/khalti-payment-button';
import { CreditCard, TestTube, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';

export default function PaymentTestPage() {
  const [testPayment, setTestPayment] = useState({
    amount: 1000,
    productName: 'Test Artist Booking',
    bookingId: 999,
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210'
    }
  });

  const [serviceType, setServiceType] = useState('artist');

  const handleServiceChange = (value: string) => {
    setServiceType(value);
    
    const serviceMap = {
      artist: { name: 'Artist Booking - DJ Performance', amount: 15000 },
      venue: { name: 'Venue Rental - Premium Hall', amount: 25000 },
      sound: { name: 'Sound Equipment - Professional Setup', amount: 8000 },
      influencer: { name: 'Influencer Collaboration - Instagram Campaign', amount: 12000 }
    };
    
    const service = serviceMap[value as keyof typeof serviceMap];
    if (service) {
      setTestPayment(prev => ({
        ...prev,
        productName: service.name,
        amount: service.amount,
        bookingId: Math.floor(Math.random() * 1000) + 1
      }));
    }
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setTestPayment(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Layout>
      <Helmet>
        <title>Payment Test | ReArt Events</title>
        <meta name="description" content="Test the Khalti payment integration with ReArt Events booking system." />
      </Helmet>

      <div className="min-h-screen bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TestTube className="h-10 w-10 text-purple-400" />
                <h1 className="text-4xl font-bold">Payment System Test</h1>
              </div>
              <p className="text-gray-300 text-lg">
                Test the complete authentication and payment flow with Khalti integration
              </p>
              <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Test Configuration */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    Payment Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Service Type</Label>
                    <Select value={serviceType} onValueChange={handleServiceChange}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="artist">Artist Booking</SelectItem>
                        <SelectItem value="venue">Venue Rental</SelectItem>
                        <SelectItem value="sound">Sound Equipment</SelectItem>
                        <SelectItem value="influencer">Influencer Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Service Name</Label>
                    <Input
                      value={testPayment.productName}
                      onChange={(e) => setTestPayment(prev => ({ ...prev, productName: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Amount (NPR)</Label>
                    <Input
                      type="number"
                      value={testPayment.amount}
                      onChange={(e) => setTestPayment(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    <p className="text-sm text-gray-400">
                      Formatted: {formatCurrency(testPayment.amount)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Customer Information</h4>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={testPayment.customerInfo.name}
                          onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          value={testPayment.customerInfo.email}
                          onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={testPayment.customerInfo.phone}
                          onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                          className="pl-10 bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Test */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Test Payment Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service:</span>
                        <span className="text-white">{testPayment.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Booking ID:</span>
                        <span className="text-white">#{testPayment.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Customer:</span>
                        <span className="text-white">{testPayment.customerInfo.name}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-purple-400">{formatCurrency(testPayment.amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-900/20 border border-purple-600 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-200 mb-2">Authentication Flow Test</h4>
                    <p className="text-sm text-purple-200 mb-4">
                      This test will verify the complete authentication flow:
                    </p>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• If not logged in: Redirect to login page</li>
                      <li>• Login/register with test credentials</li>
                      <li>• Return to payment page automatically</li>
                      <li>• Complete payment with Khalti</li>
                    </ul>
                  </div>

                  <KhaltiPaymentButton
                    bookingId={testPayment.bookingId}
                    amount={testPayment.amount}
                    productName={testPayment.productName}
                    customerInfo={testPayment.customerInfo}
                    onSuccess={(paymentId) => {
                      console.log('Payment successful:', paymentId);
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                    }}
                    className="w-full"
                  />

                  <div className="text-center text-sm text-gray-400">
                    <p>This is a test environment.</p>
                    <p>Use Khalti test credentials for payments.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="bg-gray-900 border-gray-700 mt-8">
              <CardHeader>
                <CardTitle className="text-white">Test Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Authentication Test</h4>
                    <ol className="text-sm text-gray-300 space-y-2">
                      <li>1. Click "Pay with Khalti" above</li>
                      <li>2. If not logged in, you'll be redirected to login</li>
                      <li>3. Use test credentials: username: <code className="bg-gray-800 px-1 rounded">testuser</code>, password: <code className="bg-gray-800 px-1 rounded">password123</code></li>
                      <li>4. Or create a new account</li>
                      <li>5. You'll return to complete the payment</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Khalti Payment Test</h4>
                    <ol className="text-sm text-gray-300 space-y-2">
                      <li>1. After authentication, payment will initiate</li>
                      <li>2. You'll be redirected to Khalti's test page</li>
                      <li>3. Use test payment methods</li>
                      <li>4. Complete the payment flow</li>
                      <li>5. Return to see payment confirmation</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}