import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createTestimonial } from '@/lib/api';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const testimonialSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  company: z.string().min(2, { message: 'Company must be at least 2 characters' }),
  rating: z.number().min(1).max(5),
  message: z.string().min(10, { message: 'Please share at least 10 characters about your experience' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export function ShareExperienceSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      company: '',
      rating: 5,
      message: '',
      email: '',
    },
  });

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsSubmitting(true);
    try {
      await createTestimonial({
        name: values.name,
        company: values.company,
        rating: values.rating,
        text: values.message,
        email: values.email,
      });
      
      setIsSubmitted(true);
      toast({
        title: "Thank you for sharing!",
        description: "Your testimonial has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Flying quote icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-500/10"
            initial={{ 
              x: Math.random() * 100 - 50, 
              y: Math.random() * 100 - 50,
              opacity: 0,
              scale: 0.5,
              rotate: Math.random() * 180 - 90
            }}
            animate={{ 
              x: [null, Math.random() * window.innerWidth], 
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.5, 0.5],
              rotate: [null, Math.random() * 360]
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hear from those who have experienced the excellence of Reart Events.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden border border-slate-700/50 shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {/* Background glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg blur opacity-20"></div>
              
              {/* Rating stars */}
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              {/* Testimonial quote */}
              <blockquote className="relative">
                <div className="absolute -top-4 -left-2 text-blue-400/20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-white text-lg leading-relaxed ml-4 mb-6">
                  "I hired an artist through Reart Events for our product launch, and the performance 
                  elevated the entire experience. Our clients were impressed, and the social media 
                  engagement was off the charts."
                </p>
                <footer className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
                      alt="David Chen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold">David Chen</p>
                    <p className="text-blue-300 text-sm">CEO, Innovate Design</p>
                  </div>
                </footer>
              </blockquote>
            </motion.div>
            
            {/* Client avatars */}
            <motion.div 
              className="flex justify-center mt-8 space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full overflow-hidden ${i === 1 ? 'border-2 border-blue-500' : ''}`}>
                  <img 
                    src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                    alt={`Client ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Testimonial submission form */}
          <motion.div 
            className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Share Your Experience</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Your Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John Doe" 
                                  {...field}
                                  className="bg-slate-700/50 border-slate-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Company</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your Company" 
                                  {...field}
                                  className="bg-slate-700/50 border-slate-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email"
                                {...field}
                                className="bg-slate-700/50 border-slate-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Your Rating</FormLabel>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                  key={star}
                                  type="button"
                                  variant="ghost"
                                  className="p-0 w-8 h-8"
                                  onMouseEnter={() => setHoveredStar(star)}
                                  onMouseLeave={() => setHoveredStar(null)}
                                  onClick={() => form.setValue('rating', star)}
                                >
                                  <Star 
                                    className={`w-6 h-6 ${
                                      (hoveredStar ? star <= hoveredStar : star <= field.value) 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-gray-400'
                                    }`} 
                                  />
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Your Experience</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your experience with Reart Events..."
                                {...field}
                                className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-6 rounded-lg font-medium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="mr-2 h-5 w-5" />
                            Share Your Experience
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  className="text-center py-16 flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
                  <p className="text-gray-300 max-w-md">
                    Your testimonial has been submitted successfully. We appreciate you taking the time to share your experience.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Another
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}