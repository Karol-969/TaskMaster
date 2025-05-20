import { CalendarCheck, UserCheck, Award } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Reart Events</h2>
            <p className="text-lg text-muted-foreground mb-6">
              ReArt Events is an event management company established in 2024. We specialize in providing live music solutions and managing various events.
            </p>
            <p className="text-muted-foreground mb-6">
              Our approach involves understanding client's business, audience, and goals to create tailored strategies that combine creativity and functionality. From arranging live music performances to developing crowd-engaging event concepts, we handle every detail with precision and care.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-muted rounded-full">
                  <CalendarCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold">500+</h4>
                  <p className="text-sm text-muted-foreground">Events Managed</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-muted rounded-full">
                  <UserCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold">300+</h4>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 p-3 bg-muted rounded-full">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold">15+</h4>
                  <p className="text-sm text-muted-foreground">Industry Awards</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-fade-in-up delay-100">
            <img 
              src="https://images.unsplash.com/photo-1560439514-e960a3ef5019?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=750&q=80" 
              alt="Reart Events Team" 
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        </div>

        {/* Services Offered */}
        <div className="mt-24 animate-fade-in-up delay-200">
          <h3 className="text-2xl font-bold mb-10 text-center">Services Offered</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <CalendarCheck className="h-7 w-7 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Artist/Event Management</h4>
              <p className="text-muted-foreground">
                We handle the overall management of artists and events, taking care of all the details to ensure a seamless experience.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <UserCheck className="h-7 w-7 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Live Music Arrangement</h4>
              <p className="text-muted-foreground">
                We arrange weekly live music performances, typically on Wednesdays, Fridays, and Saturdays, finding suitable performers for venues.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Monthly Artist Arrangements</h4>
              <p className="text-muted-foreground">
                This includes arranging dedicated artists on a calendar basis and conducting auditions to ensure high-quality performances.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <CalendarCheck className="h-7 w-7 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Monthly Event Concepts</h4>
              <p className="text-muted-foreground">
                We develop crowd-engaging event ideas and concepts based on specific themes to create memorable experiences.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <UserCheck className="h-7 w-7 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Promotion</h4>
              <p className="text-muted-foreground">
                We assist in promoting businesses on both digital and physical platforms to maximize your event's reach and impact.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 bg-accent/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Sponsorships</h4>
              <p className="text-muted-foreground">
                We handle sponsorship deals, connecting businesses with events that align with their brand and values.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
