import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { ArtistList } from '@/components/booking/artist-list';

export default function ArtistsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Book Artists - Reart Events</title>
        <meta name="description" content="Book renowned artists and bands for your events, from intimate gatherings to large festivals. Find the perfect performer for your occasion." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Top Artists</h1>
          <p className="text-lg text-muted-foreground">
            Discover and book exceptional talent for your next event. From classical musicians to DJs, find the perfect artist to create an unforgettable experience.
          </p>
        </div>
        
        <ArtistList />
      </div>
    </Layout>
  );
}
