import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, User, Lock, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({
        title: "Account Created!",
        description: "Welcome to ReArt Events. You have been automatically logged in.",
        variant: "default",
      });

      // Redirect to original destination or home
      setLocation(redirect);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      toast({
        title: "Registration Failed",
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
        <title>Create Account | ReArt Events</title>
        <meta name="description" content="Join ReArt Events to book top artists, venues, and manage your event planning with ease." />
      </Helmet>

      <div className="min-h-screen bg-black text-white flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <UserPlus className="h-10 w-10 text-purple-400" />
              Join ReArt Events
            </h1>
            <p className="text-gray-300">
              {fromPayment ? 'Create an account to complete your payment' : 'Create your account to get started'}
            </p>
          </div>

          {fromPayment && (
            <Alert className="mb-6 border-purple-600 bg-purple-900/20">
              <AlertDescription className="text-purple-200">
                You need an account to complete your payment. After creating your account, you'll be redirected back to complete your booking.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Create Account</CardTitle>
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
                  <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your phone number"
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
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      placeholder="Confirm your password"
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link 
                      href={`/auth/login${window.location.search}`}
                      className="text-purple-400 hover:text-purple-300 font-medium"
                    >
                      <ArrowLeft className="inline mr-1 h-3 w-3" />
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-white mb-1">Free Account</h4>
                <p className="text-sm text-gray-400">No setup fees</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Instant Access</h4>
                <p className="text-sm text-gray-400">Book immediately</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Secure Payments</h4>
                <p className="text-sm text-gray-400">Khalti protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}