import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from '@/pages/home';
import ArtistsPage from '@/pages/artists';
import ArtistDetailPage from '@/pages/artist-details';
import ServicesPage from '@/pages/services';
import WeeklyMusicService from '@/pages/services/weekly-music';
import MonthlyCalendarService from '@/pages/services/monthly-calendar';
import EventConceptsService from '@/pages/services/event-concepts';
import PromotionSponsorshipsService from '@/pages/services/promotion-sponsorships';
import ContactPage from '@/pages/contact';
import EventsPage from '@/pages/events-public';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import DashboardPage from '@/pages/dashboard';
import AdminPage from '@/pages/admin';
import AdminDashboard from '@/pages/admin-simple';
import { AdminRedirect } from '@/components/admin/admin-redirect';

function ProtectedRoute({ children, adminRequired = false }: { children: React.ReactNode, adminRequired?: boolean }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  
  if (adminRequired && !isAdmin) {
    window.location.href = '/dashboard';
    return null;
  }
  
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <AdminRedirect>
          <Home />
        </AdminRedirect>
      </Route>
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/artists/:id" component={ArtistDetailPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/weekly-music" component={WeeklyMusicService} />
      <Route path="/services/monthly-calendar" component={MonthlyCalendarService} />
      <Route path="/services/event-concepts" component={EventConceptsService} />
      <Route path="/services/promotion-sponsorships" component={PromotionSponsorshipsService} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute adminRequired>
          <AdminPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute adminRequired>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
