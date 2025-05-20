import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { TicketList } from '@/components/booking/ticket-list';

export default function TicketsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Event Tickets - Reart Events</title>
        <meta name="description" content="Secure tickets for the hottest concerts, festivals, and exclusive events across the country. Don't miss out on your favorite performances." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-lg text-muted-foreground">
            Browse and purchase tickets for upcoming concerts, festivals, and exclusive events. Secure your spot today and get ready for unforgettable experiences.
          </p>
        </div>
        
        <TicketList />
      </div>
    </Layout>
  );
}
