import { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleAdminLogin = async (values: AdminLoginFormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const userData = await response.json();
      
      // Verify admin role
      if (userData.role !== 'admin') {
        throw new Error('Access denied: Admin privileges required');
      }
      
      toast({
        title: "Welcome, Administrator!",
        description: "You have successfully logged into the admin panel.",
      });
      
      // Redirect to dedicated full-screen admin dashboard
      window.location.href = '/admin/dashboard';
      
    } catch (error) {
      toast({
        title: "Access Denied",
        description: error instanceof Error ? error.message : "Invalid admin credentials.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login - ReArt Events</title>
        <meta name="description" content="Secure admin login for ReArt Events management panel." />
      </Helmet>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to Main Site */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Main Site
        </Button>

        <Card className="bg-black/50 backdrop-blur-xl border-slate-800 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Admin Portal</CardTitle>
            <p className="text-gray-400 mt-2">
              Secure access to ReArt Events administrative dashboard
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAdminLogin)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Administrator Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter admin username"
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500 h-12"
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Administrator Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter admin password"
                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500 h-12 pr-12"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-12 text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Access Admin Panel
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            {/* Security Notice */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 mt-6">
              <p className="text-gray-300 text-sm text-center">
                🔒 This is a secure administrative area. All login attempts are monitored and logged.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ReArt Events Administrative Portal © 2024
          </p>
        </div>
      </div>
    </div>
  );
}