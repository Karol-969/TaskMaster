import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { toast } = useToast();

  // Get redirect URL from query params (for post-payment redirects)
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect') || '/';
  const fromPayment = urlParams.get('from') === 'payment';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
        variant: "default",
      });

      // Redirect to original destination or home
      setLocation(redirect);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      <Helmet>
        <title>Login | ReArt Events</title>
        <meta name="description" content="Sign in to your ReArt Events account to book artists, venues, and manage your event bookings." />
      </Helmet>

      <div className="min-h-screen bg-black text-white flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <LogIn className="h-10 w-10 text-purple-400" />
              Welcome Back
            </h1>
            <p className="text-gray-300">
              {fromPayment ? 'Please sign in to complete your payment' : 'Sign in to your account'}
            </p>
          </div>

          {fromPayment && (
            <Alert className="mb-6 border-purple-600 bg-purple-900/20">
              <AlertDescription className="text-purple-200">
                You need to be logged in to complete your payment. After signing in, you'll be redirected back to complete your booking.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-600 bg-red-900/20">
                    <AlertDescription className="text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link 
                      href={`/auth/register${window.location.search}`}
                      className="text-purple-400 hover:text-purple-300 font-medium"
                    >
                      Create one here
                      <ArrowRight className="inline ml-1 h-3 w-3" />
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-white mb-1">Secure Login</h4>
                <p className="text-sm text-gray-400">Protected sessions</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Quick Access</h4>
                <p className="text-sm text-gray-400">Instant booking</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Safe Payments</h4>
                <p className="text-sm text-gray-400">Khalti integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}