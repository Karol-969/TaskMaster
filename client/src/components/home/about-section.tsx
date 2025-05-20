import { CalendarCheck, UserCheck, Award } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Reart Events</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded with a passion for creating unforgettable experiences, Reart Events has evolved into a premier event management company known for excellence and innovation.
            </p>
            <p className="text-muted-foreground mb-6">
              Our team of dedicated professionals combines creativity with meticulous planning to ensure every event exceeds expectations. From intimate gatherings to grand celebrations, we handle every detail with precision and care.
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

        {/* Timeline */}
        <div className="mt-24 animate-fade-in-up delay-200">
          <h3 className="text-2xl font-bold mb-10 text-center">Our Journey</h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-accent transform md:translate-x-[-50%] hidden md:block"></div>
            
            {/* Timeline items */}
            <div className="space-y-12 md:space-y-0">
              {/* 2016 */}
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 order-2 md:order-1 md:text-right md:pr-12 pt-2 md:pt-0">
                  <h4 className="text-xl font-bold mb-2">Humble Beginnings</h4>
                  <p className="text-muted-foreground">
                    Reart Events was founded as a small booking agency for local artists and venues.
                  </p>
                </div>
                <div className="mb-4 md:mb-0 order-1 md:order-2 bg-accent text-white rounded-full py-2 px-4 font-bold relative md:mx-4 z-10">
                  2016
                </div>
                <div className="flex-1 order-3 pl-0 md:pl-12 pt-2 md:pt-0">
                  <div className="hidden md:block">&nbsp;</div>
                </div>
              </div>
              
              {/* 2018 */}
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 order-2 md:order-1 md:text-right md:pr-12 pt-2 md:pt-0">
                  <div className="hidden md:block">&nbsp;</div>
                </div>
                <div className="mb-4 md:mb-0 order-1 md:order-2 bg-accent text-white rounded-full py-2 px-4 font-bold relative md:mx-4 z-10">
                  2018
                </div>
                <div className="flex-1 order-3 pl-0 md:pl-12 pt-2 md:pt-0">
                  <h4 className="text-xl font-bold mb-2">Expanding Horizons</h4>
                  <p className="text-muted-foreground">
                    Added sound system rentals and influencer bookings to our growing service portfolio.
                  </p>
                </div>
              </div>
              
              {/* 2020 */}
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 order-2 md:order-1 md:text-right md:pr-12 pt-2 md:pt-0">
                  <h4 className="text-xl font-bold mb-2">Digital Transformation</h4>
                  <p className="text-muted-foreground">
                    Launched our online booking platform and introduced virtual event management services.
                  </p>
                </div>
                <div className="mb-4 md:mb-0 order-1 md:order-2 bg-accent text-white rounded-full py-2 px-4 font-bold relative md:mx-4 z-10">
                  2020
                </div>
                <div className="flex-1 order-3 pl-0 md:pl-12 pt-2 md:pt-0">
                  <div className="hidden md:block">&nbsp;</div>
                </div>
              </div>
              
              {/* 2022 */}
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 order-2 md:order-1 md:text-right md:pr-12 pt-2 md:pt-0">
                  <div className="hidden md:block">&nbsp;</div>
                </div>
                <div className="mb-4 md:mb-0 order-1 md:order-2 bg-accent text-white rounded-full py-2 px-4 font-bold relative md:mx-4 z-10">
                  2022
                </div>
                <div className="flex-1 order-3 pl-0 md:pl-12 pt-2 md:pt-0">
                  <h4 className="text-xl font-bold mb-2">National Recognition</h4>
                  <p className="text-muted-foreground">
                    Recognized as one of the top event management companies with a growing presence nationwide.
                  </p>
                </div>
              </div>
              
              {/* 2023 */}
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-1 order-2 md:order-1 md:text-right md:pr-12 pt-2 md:pt-0">
                  <h4 className="text-xl font-bold mb-2">Present & Future</h4>
                  <p className="text-muted-foreground">
                    Continuing to innovate with enhanced digital experiences and exclusive event partnerships.
                  </p>
                </div>
                <div className="mb-4 md:mb-0 order-1 md:order-2 bg-accent text-white rounded-full py-2 px-4 font-bold relative md:mx-4 z-10">
                  2023
                </div>
                <div className="flex-1 order-3 pl-0 md:pl-12 pt-2 md:pt-0">
                  <div className="hidden md:block">&nbsp;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
