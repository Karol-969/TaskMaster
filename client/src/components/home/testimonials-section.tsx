import { useQuery } from '@tanstack/react-query';
import { Quote } from 'lucide-react';
import { truncateText } from '@/lib/utils';

interface TestimonialCardProps {
  content: string;
  author: string;
  position: string;
  initials: string;
  delay?: number;
}

function TestimonialCard({ content, author, position, initials, delay = 0 }: TestimonialCardProps) {
  return (
    <div className="bg-muted rounded-xl p-8 relative animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute top-4 left-4 text-5xl text-accent opacity-30">
        <Quote />
      </div>
      <div className="relative z-10">
        <p className="mb-6 text-muted-foreground">
          "{content}"
        </p>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-muted-foreground/10 rounded-full overflow-hidden mr-4 flex items-center justify-center bg-accent text-white">
            {initials}
          </div>
          <div>
            <h4 className="font-bold">{author}</h4>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/testimonials');
      return res.json();
    }
  });

  // Mock testimonial data since we don't have complete info from the API
  const testimonialsData = [
    {
      id: 1,
      content: "Working with Reart Events for our corporate gala was seamless. Their attention to detail and ability to book top-tier talent transformed our event from standard to spectacular.",
      author: "Michael Johnson",
      position: "Marketing Director, Tech Innovations",
      initials: "MJ"
    },
    {
      id: 2,
      content: "The sound system and venue we booked through Reart Events exceeded our expectations. The team was responsive, professional, and delivered exactly what we needed for our music festival.",
      author: "Sarah Parker",
      position: "Event Producer, Harmony Festivals",
      initials: "SP"
    },
    {
      id: 3,
      content: "From booking the perfect venue to coordinating with influencers for our product launch, Reart Events handled everything with professionalism and creativity. Highly recommended!",
      author: "Alex Rodriguez",
      position: "CEO, Fusion Apparel",
      initials: "AR"
    }
  ];

  // Use API testimonials if available, otherwise use mock data
  const displayTestimonials = testimonials.length > 0 ? testimonials : testimonialsData;

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading testimonials:', error);
  }

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from those who have experienced the excellence of Reart Events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              content={testimonial.content ? truncateText(testimonial.content, 200) : ""}
              author={testimonial.author || "Happy Client"}
              position={testimonial.position || "Satisfied Customer"}
              initials={testimonial.initials || "HC"}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
