import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { SoundList } from '@/components/booking/sound-list';

export default function SoundSystemsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Rent Sound Systems - Reart Events</title>
        <meta name="description" content="Premium sound equipment rentals with professional setup and technical support. Find the perfect sound system for your event." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Premium Sound Systems</h1>
          <p className="text-lg text-muted-foreground">
            Create the perfect audio experience for your event with our high-quality sound systems. From intimate gatherings to large concerts, we have equipment for every venue size.
          </p>
        </div>
        
        <SoundList />
      </div>
    </Layout>
  );
}
