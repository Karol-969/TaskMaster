import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { HeroSection } from '@/components/home/hero-section';
import { ServicesSection } from '@/components/home/services-section';
import { AboutSection } from '@/components/home/about-section';
import { ArtistsSection } from '@/components/home/artists-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { ContactSection } from '@/components/home/contact-section';
import { NewsletterSection } from '@/components/home/newsletter-section';

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Reart Events - Premium Event Management & Booking</title>
        <meta name="description" content="Premium event management and booking platform. Book top artists, influencers, sound systems, venues and event tickets all in one place." />
        <meta property="og:title" content="Reart Events - Premium Event Management & Booking" />
        <meta property="og:description" content="From booking top artists to securing premium venues, we manage every detail of your event journey with precision and elegance." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ArtistsSection />
      <TestimonialsSection />
      <ContactSection />
      <NewsletterSection />
    </Layout>
  );
}
