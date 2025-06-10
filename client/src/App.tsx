import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatWidget } from "@/components/chat/chat-widget";
import NotFound from "@/pages/not-found";

// Pages
import Home from '@/pages/home';
import ArtistsPage from '@/pages/artists';
import ArtistDetailPage from '@/pages/artist-details';
import ServicesPage from '@/pages/services';
import WeeklyMusicService from '@/pages/services/weekly-music';
import MonthlyArtistsService from '@/pages/services/monthly-artists';
import EventConceptsService from '@/pages/services/event-concepts';
import PromotionSponsorshipsService from '@/pages/services/promotion-sponsorships';
import ContactPage from '@/pages/contact';
import EventsPage from '@/pages/events-public';
import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminUsersPage from '@/pages/admin/users';
import AdminArtistsPage from '@/pages/admin/artists';
import AdminEventsPage from '@/pages/admin/events';
import AdminSoundEquipmentPage from '@/pages/admin/sound-equipment';
import AdminContentPage from '@/pages/admin/content';
import SoundPage from '@/pages/sound';
import BlogPage from '@/pages/blog';
import BlogPostPage from '@/pages/blog-post';




function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/artists/:id" component={ArtistDetailPage} />
      <Route path="/sound" component={SoundPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/weekly-music" component={WeeklyMusicService} />
      <Route path="/services/monthly-artists" component={MonthlyArtistsService} />
      <Route path="/services/event-concepts" component={EventConceptsService} />
      <Route path="/services/promotion-sponsorships" component={PromotionSponsorshipsService} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/artists" component={AdminArtistsPage} />
      <Route path="/admin/sound-equipment" component={AdminSoundEquipmentPage} />
      <Route path="/admin/events" component={AdminEventsPage} />
      <Route path="/admin/content" component={AdminContentPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
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
            <ChatWidget />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;