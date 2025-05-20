import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { InfluencerList } from '@/components/booking/influencer-list';

export default function InfluencersPage() {
  return (
    <Layout>
      <Helmet>
        <title>Book Influencers - Reart Events</title>
        <meta name="description" content="Connect with trending social media personalities to amplify your brand message and reach. Book influencers for your marketing campaigns and events." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Top Influencers</h1>
          <p className="text-lg text-muted-foreground">
            Partner with social media personalities that match your brand values and marketing goals. Boost your digital presence with the right influencer collaboration.
          </p>
        </div>
        
        <InfluencerList />
      </div>
    </Layout>
  );
}
