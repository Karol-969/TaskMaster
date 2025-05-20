import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { ContactSection } from '@/components/home/contact-section';

export default function ContactPage() {
  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Reart Events</title>
        <meta name="description" content="Get in touch with our team to plan your next event. We're here to help with bookings, inquiries, and special requests." />
      </Helmet>
      
      <div className="py-12">
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have questions or ready to start planning your next event? Reach out to our team for personalized assistance.
            </p>
          </div>
        </div>
        
        <ContactSection />
      </div>
    </Layout>
  );
}
