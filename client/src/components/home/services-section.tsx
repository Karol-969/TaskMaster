import { Link } from 'wouter';
import { Music, Instagram, Speaker, Building, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  linkTo: string;
  delay?: number;
}

function ServiceCard({ title, description, icon, image, linkTo, delay = 0 }: ServiceCardProps) {
  return (
    <Card className="bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="text-accent">{icon}</div>
        </div>
        <p className="text-muted-foreground mb-5 text-sm">
          {description}
        </p>
        <Link href={linkTo}>
          <a className="block text-center py-2 border border-accent text-accent rounded-md hover:bg-accent hover:text-white transition-all">
            Book Now
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}

export function ServicesSection() {
  const services = [
    {
      title: 'Artist Booking',
      description: 'Book renowned artists and bands for your events, from intimate gatherings to large festivals.',
      icon: <Music className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/artists',
    },
    {
      title: 'Influencer Booking',
      description: 'Connect with trending social media personalities to amplify your brand message and reach.',
      icon: <Instagram className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/influencers',
    },
    {
      title: 'Sound Systems',
      description: 'Premium sound equipment rentals with professional setup and technical support.',
      icon: <Speaker className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/sound-systems',
    },
    {
      title: 'Venue Booking',
      description: 'Discover and secure the perfect venue for your event, from intimate spaces to grand halls.',
      icon: <Building className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/venues',
    },
    {
      title: 'Event Tickets',
      description: 'Secure tickets for the hottest concerts, festivals, and exclusive events across the country.',
      icon: <Ticket className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/tickets',
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elevate your events with our comprehensive suite of services designed to create unforgettable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title}
              {...service}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
