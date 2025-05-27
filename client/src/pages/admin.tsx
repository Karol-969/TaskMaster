import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
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
        navigate('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the admin dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - Reart Events</title>
        <meta name="description" content="Admin dashboard for managing bookings, users, and listings on Reart Events platform." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <AdminDashboard />
      </div>
    </Layout>
  );
}
