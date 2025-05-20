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
import InfluencersPage from '@/pages/influencers';
import SoundSystemsPage from '@/pages/sound-systems';
import VenuesPage from '@/pages/venues';
import TicketsPage from '@/pages/tickets';
import ContactPage from '@/pages/contact';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import DashboardPage from '@/pages/dashboard';
import AdminPage from '@/pages/admin';

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
      <Route path="/" component={Home} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/influencers" component={InfluencersPage} />
      <Route path="/sound-systems" component={SoundSystemsPage} />
      <Route path="/venues" component={VenuesPage} />
      <Route path="/tickets" component={TicketsPage} />
      <Route path="/contact" component={ContactPage} />
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
