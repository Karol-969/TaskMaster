import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function HeroSection() {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');

  const handleCheckAvailability = () => {
    // In a real app, this would navigate to the appropriate booking page
    // or show a more detailed form based on the selected service
    if (!serviceType) {
      alert('Please select a service type');
      return;
    }
    
    if (serviceType === 'artist') {
      window.location.href = '/artists';
    } else if (serviceType === 'influencer') {
      window.location.href = '/influencers';
    } else if (serviceType === 'sound') {
      window.location.href = '/sound-systems';
    } else if (serviceType === 'venue') {
      window.location.href = '/venues';
    } else if (serviceType === 'ticket') {
      window.location.href = '/tickets';
    }
  };

  return (
    <section id="home" className="relative pt-16 pb-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="Premium event venue" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              Elite Event Experiences <span className="text-accent">Crafted</span> to Perfection
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-xl animate-fade-in-up delay-100">
              From booking top artists to securing premium venues, we manage every detail of your event journey with precision and elegance.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              <Link href="#services">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Explore Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-accent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block animate-fade-in-up delay-300">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-white text-2xl font-semibold mb-6">Quick Booking</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service-type" className="text-white mb-2">What are you looking for?</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="service-type" className="w-full bg-white/20 text-white border-white/30 focus:ring-accent">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artist">Book an Artist</SelectItem>
                      <SelectItem value="influencer">Book an Influencer</SelectItem>
                      <SelectItem value="sound">Book Sound System</SelectItem>
                      <SelectItem value="venue">Book a Venue</SelectItem>
                      <SelectItem value="ticket">Buy Event Tickets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="event-date" className="text-white mb-2">Event Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/20 text-white border-white/30 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-white mb-2">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/20 text-white border-white/30 focus:ring-accent"
                  />
                </div>
                
                <Button 
                  type="button" 
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  onClick={handleCheckAvailability}
                >
                  Check Availability
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
        <a href="#services" className="text-white animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
