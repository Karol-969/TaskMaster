import { useState } from 'react';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would send the form data to an API
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions or ready to start planning your next event? Reach out to our team for personalized assistance.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mt-1 mr-4 p-3 bg-background rounded-full shadow-md">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    Chagal, Kathmandu<br />
                    Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-4 p-3 bg-background rounded-full shadow-md">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone</h4>
                  <p className="text-muted-foreground">
                    +977-9860673425<br />
                    +977-9865139809
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-4 p-3 bg-background rounded-full shadow-md">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-muted-foreground">
                    reart.nepal@gmail.com<br />
                    business@reartevents.com.np
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-4 p-3 bg-background rounded-full shadow-md">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Working Hours</h4>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <a href="#" className="p-3 bg-background rounded-full shadow-md hover:bg-muted/80 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="p-3 bg-background rounded-full shadow-md hover:bg-muted/80 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="p-3 bg-background rounded-full shadow-md hover:bg-muted/80 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="p-3 bg-background rounded-full shadow-md hover:bg-muted/80 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-100">
            <div className="bg-background rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name"
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject"
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message"
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
