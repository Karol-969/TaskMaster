import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KhaltiPaymentButton } from '@/components/payment/khalti-payment-button';
import { PaymentStatusTracker } from '@/components/payment/payment-status-tracker';
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

  const [lastPaymentId, setLastPaymentId] = useState<number | undefined>();
  const [lastPidx, setLastPidx] = useState<string | undefined>();

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
                    <h4 className="font-semibold text-purple-200 mb-2">Khalti Payment Test</h4>
                    <p className="text-sm text-purple-200 mb-4">
                      This will test the complete Khalti payment integration:
                    </p>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Click "Pay with Khalti" to initiate payment</li>
                      <li>• You'll be redirected to Khalti's payment page</li>
                      <li>• Use your Khalti wallet credentials to complete payment</li>
                      <li>• Return to see payment confirmation</li>
                    </ul>
                  </div>

                  <KhaltiPaymentButton
                    bookingId={testPayment.bookingId}
                    amount={testPayment.amount}
                    productName={testPayment.productName}
                    customerInfo={testPayment.customerInfo}
                    onSuccess={(paymentId) => {
                      console.log('Payment successful:', paymentId);
                      setLastPaymentId(paymentId);
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

            {/* Payment Status Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <PaymentStatusTracker
                paymentId={lastPaymentId}
                pidx={lastPidx}
                onStatusChange={(status) => {
                  console.log('Payment status changed to:', status);
                  if (status === 'completed') {
                    console.log('Payment completed successfully!');
                  }
                }}
              />
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Test Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lastPaymentId && (
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Payment #{lastPaymentId}</p>
                          <p className="text-sm text-gray-400">PIDX: {lastPidx}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setLastPaymentId(lastPaymentId);
                            setLastPidx(lastPidx);
                          }}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Track Status
                        </Button>
                      </div>
                    )}
                    
                    {!lastPaymentId && (
                      <div className="text-center text-gray-400 py-6">
                        <p>No recent payments</p>
                        <p className="text-sm">Complete a test payment to see tracking</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="bg-gray-900 border-gray-700 mt-8">
              <CardHeader>
                <CardTitle className="text-white">Payment Testing Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Step 1: Initiate Payment</h4>
                    <ol className="text-sm text-gray-300 space-y-2">
                      <li>1. Configure payment details above</li>
                      <li>2. Set amount (recommend Rs 10 for testing)</li>
                      <li>3. Fill customer information</li>
                      <li>4. Click "Pay with Khalti"</li>
                      <li>5. You'll be redirected to Khalti's payment page</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Step 2: Complete Payment</h4>
                    <div className="space-y-3">
                      <div className="bg-green-900/20 border border-green-600 p-3 rounded">
                        <p className="text-sm text-green-200 font-medium mb-2">For Real Payments:</p>
                        <ul className="text-xs text-green-200 space-y-1">
                          <li>• Use your actual Khalti mobile number</li>
                          <li>• Enter your Khalti wallet password/MPIN</li>
                          <li>• Complete the payment normally</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-900/20 border border-blue-600 p-3 rounded">
                        <p className="text-sm text-blue-200 font-medium mb-2">For Test Environment:</p>
                        <ul className="text-xs text-blue-200 space-y-1">
                          <li>• Mobile: <code className="bg-gray-800 px-1 rounded">9800000001</code></li>
                          <li>• MPIN: <code className="bg-gray-800 px-1 rounded">1111</code></li>
                          <li>• Or use bank payment with test credentials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Step 3: Verification</h4>
                    <ol className="text-sm text-gray-300 space-y-2">
                      <li>1. After payment, you'll return to our site</li>
                      <li>2. Check payment status page</li>
                      <li>3. Verify booking confirmation</li>
                      <li>4. Check admin panel for payment record</li>
                      <li>5. Test complete!</li>
                    </ol>
                    
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded">
                      <p className="text-xs text-yellow-200">
                        <strong>Note:</strong> Small test amounts (Rs 10-50) are recommended to verify the integration without significant charges.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="font-semibold text-white mb-3">Environment Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-white font-medium">API Integration</span>
                      </div>
                      <p className="text-sm text-gray-300">Connected to Khalti API</p>
                      <p className="text-xs text-gray-400">Production credentials detected</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <span className="text-white font-medium">Payment Gateway</span>
                      </div>
                      <p className="text-sm text-gray-300">Using Khalti's secure gateway</p>
                      <p className="text-xs text-gray-400">Supports all major payment methods</p>
                    </div>
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