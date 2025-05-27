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
import AdminDashboard from "./pages/admin-dashboard";
import AdminLogin from "./pages/admin-login";
import AdminSimple from "./pages/admin-simple";




function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/artists/:id" component={ArtistDetailPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/weekly-music" component={WeeklyMusicService} />
      <Route path="/services/monthly-calendar" component={MonthlyCalendarService} />
      <Route path="/services/event-concepts" component={EventConceptsService} />
      <Route path="/services/promotion-sponsorships" component={PromotionSponsorshipsService} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin-simple" component={AdminSimple} />
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