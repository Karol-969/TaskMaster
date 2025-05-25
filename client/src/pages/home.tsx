import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { HeroSection } from '@/components/home/hero-section';
import { ServicesSection } from '@/components/home/services-section';
import { AboutSection } from '@/components/home/about-section';
import { JourneySection } from '@/components/home/journey-section';
import { FeaturedArtistsShowcase } from '@/components/home/featured-artists-showcase';
import { ShareExperienceSection } from '@/components/home/share-experience-section';
import { ContactSection } from '@/components/home/contact-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { UserProfileSection } from '@/components/home/user-profile-section';
import { useAuth } from '@/providers/auth-provider';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Helmet>
        <title>Reart Events - Premium Event Management & Booking</title>
        <meta name="description" content="Premium event management and booking platform. Book top artists, influencers, sound systems, venues and event tickets all in one place." />
        <meta property="og:title" content="Reart Events - Premium Event Management & Booking" />
        <meta property="og:description" content="From booking top artists to securing premium venues, we manage every detail of your event journey with precision and elegance." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {isAuthenticated ? (
        // Logged-in user layout with profile section
        <div className="flex">
          {/* Main content area */}
          <div className="flex-1">
            <HeroSection />
            <ServicesSection />
            <AboutSection />
            <JourneySection />
            <FeaturedArtistsShowcase />
            <ShareExperienceSection />
          </div>
          
          {/* Profile sidebar */}
          <div className="w-80 min-h-screen bg-slate-900/50 p-6 sticky top-0">
            <UserProfileSection />
          </div>
        </div>
      ) : (
        // Default layout for non-logged-in users
        <>
          <HeroSection />
          <ServicesSection />
          <AboutSection />
          <JourneySection />
          <FeaturedArtistsShowcase />
          <ShareExperienceSection />
          <ContactSection />
          <NewsletterSection />
        </>
      )}
    </Layout>
  );
}
