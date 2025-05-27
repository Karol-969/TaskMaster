import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { useAuth } from '@/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-64 bg-slate-800" />
            <Skeleton className="h-10 w-32 bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-slate-800" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-slate-800" />
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>ReArt Events - Admin Panel</title>
        <meta name="description" content="Comprehensive admin panel for managing the ReArt Events platform." />
      </Helmet>
      
      <AdminDashboard />
    </div>
  );
}