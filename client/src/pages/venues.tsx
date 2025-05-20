import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { VenueList } from '@/components/booking/venue-list';

export default function VenuesPage() {
  return (
    <Layout>
      <Helmet>
        <title>Book Venues - Reart Events</title>
        <meta name="description" content="Discover and secure the perfect venue for your event, from intimate spaces to grand halls. Find venues with the right capacity and amenities." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Perfect Venues</h1>
          <p className="text-lg text-muted-foreground">
            Discover exceptional spaces to host your events. From elegant ballrooms to intimate meeting rooms, we have venues for every occasion and size.
          </p>
        </div>
        
        <VenueList />
      </div>
    </Layout>
  );
}
