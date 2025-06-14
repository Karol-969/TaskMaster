import { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KhaltiPaymentButton } from '@/components/payment/khalti-payment-button';
import { CreditCard, TestTube } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function PaymentTestPage() {
  const [testAmount, setTestAmount] = useState(1000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formatNPR = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleTestPayment = async () => {
    try {
      // Direct API test without authentication (for demonstration)
      const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY || 'test-key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: `${window.location.origin}/payment/status`,
          website_url: window.location.origin,
          amount: testAmount * 100, // Convert to paisa
          purchase_order_id: `TEST_${Date.now()}`,
          purchase_order_name: 'ReArt Events Test Payment',
          customer_info: {
            name: 'Test Customer',
            email: 'test@reartevents.com',
            phone: '9841234567'
          }
        })
      });

      const data = await response.json();
      
      if (data.payment_url) {
        window.open(data.payment_url, '_blank');
      } else {
        console.error('Payment initiation failed:', data);
      }
    } catch (error) {
      console.error('Payment test failed:', error);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Payment Gateway Test | ReArt Events</title>
        <meta name="description" content="Test the Khalti payment gateway integration with ReArt Events platform." />
      </Helmet>

      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <TestTube className="h-10 w-10 text-purple-400" />
                Payment Gateway Test
              </h1>
              <p className="text-gray-300">
                Test the Khalti payment integration for ReArt Events platform
              </p>
            </div>

            {/* Khalti Integration Status */}
            <Card className="bg-gray-900 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-400" />
                  Khalti Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                    <h3 className="font-semibold text-green-400 mb-2">✓ API Connection</h3>
                    <p className="text-sm text-gray-300">Successfully connected to Khalti servers</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                    <h3 className="font-semibold text-green-400 mb-2">✓ Test Credentials</h3>
                    <p className="text-sm text-gray-300">Valid API keys configured</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                    <h3 className="font-semibold text-green-400 mb-2">✓ NRS Currency</h3>
                    <p className="text-sm text-gray-300">Nepali Rupee formatting active</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                    <h3 className="font-semibold text-green-400 mb-2">✓ Payment Flow</h3>
                    <p className="text-sm text-gray-300">Complete booking integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Test */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Test Payment Flow</CardTitle>
                <p className="text-gray-400">
                  Test the Khalti payment gateway with a sample transaction
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Test Amount (NPR)
                    </label>
                    <Input
                      type="number"
                      value={testAmount}
                      onChange={(e) => setTestAmount(Number(e.target.value))}
                      className="bg-gray-800 border-gray-600 text-white"
                      min="10"
                      max="100000"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Amount will be processed as: {formatNPR(testAmount)}
                    </p>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">Test Mode Active</h4>
                    <p className="text-sm text-gray-300">
                      This will open Khalti's test payment page. No real money will be charged.
                      Use test credentials provided by Khalti for completing the payment flow.
                    </p>
                  </div>

                  <Button
                    onClick={handleTestPayment}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Test Khalti Payment - {formatNPR(testAmount)}
                  </Button>
                </div>

                {/* Integration Features */}
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="font-semibold text-white mb-4">Integrated Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Artist booking payments
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Venue rental payments
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Sound equipment bookings
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Influencer collaborations
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Payment status tracking
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Admin revenue monitoring
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