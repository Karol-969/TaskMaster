import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function AdminRedirect({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    
    // If user is an authenticated admin and trying to access home page, redirect to admin dashboard
    if (isAuthenticated && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [navigate]);
  
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  
  // Don't render home page content for admin users
  if (isAuthenticated && isAdmin) {
    return null;
  }
  
  return <>{children}</>;
}