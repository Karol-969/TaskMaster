import { Music } from 'lucide-react';
import { ServiceDetailLayout } from '@/components/services/service-detail-layout';

export default function WeeklyMusicService() {
  return (
    <ServiceDetailLayout
      title="Weekly Live Music Arrangement"
      description="Our weekly live music arrangement service provides high-quality performers for your venue on a consistent schedule. We handle artist selection, scheduling, and all logistics to ensure smooth performances on Wednesdays, Fridays, and Saturdays."
      image="https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"
      icon={<Music className="h-10 w-10 text-accent" />}
      features={[
        "Arrangement of various artists for three days a week (Wednesday, Friday, Saturday)",
        "Carefully curated performers matched to your venue's atmosphere",
        "Complete scheduling and artist management",
        "Reliable replacements in case of performer unavailability",
        "Regular rotation of artists to maintain freshness and variety",
        "Professional sound check and equipment setup coordination"
      ]}
      benefits={[
        "Consistent high-quality entertainment without management hassle",
        "Diverse music offerings to attract different audience segments",
        "Increased customer retention through regular entertainment schedule",
        "Professional performers that enhance venue atmosphere",
        "Simplified booking process with a single point of contact",
        "Reduced administrative work for venue management"
      ]}
      faqs={[
        {
          question: "What types of venues is this service best suited for?",
          answer: "Our weekly live music arrangement service is ideal for restaurants, bars, lounges, hotels, and similar establishments looking to provide regular live entertainment for their guests."
        },
        {
          question: "Can we request specific artists or music styles?",
          answer: "Absolutely! We work closely with venues to understand their preferences and audience, tailoring our artist selection to match your specific requirements for style, genre, and atmosphere."
        },
        {
          question: "What happens if an artist cancels at the last minute?",
          answer: "We maintain a roster of backup performers and have contingency plans in place. In the rare event of a last-minute cancellation, we'll quickly arrange a replacement artist of similar quality and style."
        },
        {
          question: "Do we need to provide sound equipment?",
          answer: "This depends on your venue setup. We can work with existing sound systems or help coordinate equipment rental if needed. We'll assess your needs during our initial consultation."
        }
      ]}
      ctaText="Schedule a Consultation"
    />
  );
}