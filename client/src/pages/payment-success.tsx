import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, Download, Calendar, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

export default function PaymentStatusPage() {
  const [location, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const booking = urlParams.get('booking');
    const errorParam = urlParams.get('error');

    if (payment) {
      setPaymentStatus(payment as 'success' | 'failed' | 'pending');
    }
    
    if (booking) {
      setBookingId(booking);
    }
    
    if (errorParam) {
      setError(errorParam);
    }

    // Auto redirect to home page after successful payment
    if (payment === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed. Redirecting to home page...",
        duration: 4000,
      });

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setLocation('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [location, toast, setLocation]);

  const formatNPR = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-400" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-400" />;
      case 'pending':
        return <AlertCircle className="h-16 w-16 text-yellow-400" />;
      default:
        return <AlertCircle className="h-16 w-16 text-gray-400" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Payment Status Unknown';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Your booking has been confirmed and payment processed successfully.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. Please wait for confirmation.';
      default:
        return 'Unable to determine payment status.';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      case 'pending':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Payment Status | ReArt Events</title>
        <meta name="description" content="Check your payment status and booking confirmation for ReArt Events services." />
      </Helmet>

      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  {getStatusIcon()}
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {getStatusTitle()}
                </CardTitle>
                <Badge className={`${getStatusColor()} text-white`}>
                  {paymentStatus?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-gray-300 text-center text-lg">
                  {getStatusMessage()}
                </p>

                {paymentStatus === 'success' && countdown > 0 && (
                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Home className="h-5 w-5 text-green-400" />
                      <span className="text-green-200 font-medium">Redirecting to Home</span>
                    </div>
                    <p className="text-green-300 text-sm">
                      Taking you back to the main page in <span className="font-bold text-green-200">{countdown}</span> seconds...
                    </p>
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <Button 
                      onClick={() => setLocation('/')}
                      variant="outline" 
                      size="sm" 
                      className="mt-3 border-green-600 text-green-300 hover:bg-green-900/20"
                    >
                      Go to Home Now
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <p className="text-red-300 text-sm">
                      <strong>Error:</strong> {error.replace(/_/g, ' ')}
                    </p>
                  </div>
                )}

                {bookingId && (
                  <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-white mb-2">Booking Details</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Booking ID:</span>
                      <span className="font-mono text-purple-400">#{bookingId}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {paymentStatus === 'success' && (
                    <>
                      <Link href="/bookings" className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <Calendar className="mr-2 h-4 w-4" />
                          View My Bookings
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </Button>
                    </>
                  )}

                  {paymentStatus === 'failed' && (
                    <>
                      <Link href="/" className="flex-1">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Try Again
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                        Contact Support
                      </Button>
                    </>
                  )}

                  {paymentStatus === 'pending' && (
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                    >
                      Refresh Status
                    </Button>
                  )}

                  {!paymentStatus && (
                    <Link href="/" className="w-full">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Return to Home
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <h4 className="font-semibold text-white mb-1">Secure Payment</h4>
                      <p className="text-sm text-gray-400">256-bit SSL encrypted</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Instant Confirmation</h4>
                      <p className="text-sm text-gray-400">Real-time booking updates</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">24/7 Support</h4>
                      <p className="text-sm text-gray-400">Help when you need it</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-gray-500 text-sm">
                    Need help? Contact us at{' '}
                    <a href="mailto:support@reartevents.com" className="text-purple-400 hover:underline">
                      support@reartevents.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}