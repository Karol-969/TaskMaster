import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { ServiceChat } from '@/components/chat/service-chat';
import { motion } from 'framer-motion';
import { Music, Calendar, Clock, Users, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WeeklyMusicPage() {
  const features = [
    "Professional artist selection and vetting",
    "Consistent schedule: Wednesday, Friday, Saturday",
    "All logistics and coordination handled",
    "Venue-matched performer selection",
    "Audience preference consideration",
    "Backup artist arrangements"
  ];

  const benefits = [
    {
      icon: <Music className="h-6 w-6 text-blue-600" />,
      title: "High-Quality Performances",
      description: "Carefully vetted artists who match your venue's atmosphere"
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: "Reliable Schedule",
      description: "Consistent entertainment three days a week"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Audience Engagement",
      description: "Artists selected to connect with your specific audience"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Hassle-Free Management",
      description: "Complete logistics handling from start to finish"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Weekly Live Music Arrangement | ReArt Events</title>
        <meta name="description" content="Professional weekly live music arrangements for venues. High-quality performers every Wednesday, Friday, and Saturday with complete logistics management." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-blue-600 text-white">Live Music Service</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Weekly Live Music <span className="text-blue-400">Arrangement</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform your venue with consistent, high-quality live music performances. 
              Professional artists every Wednesday, Friday, and Saturday.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                View Sample Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Consistent Quality Entertainment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our weekly live music arrangement service provides your venue with reliable, 
                high-quality entertainment three days a week. We handle every aspect of the 
                process, from artist selection to performance coordination, ensuring your 
                guests always have an exceptional musical experience.
              </p>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Live music performance"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">3 Days</div>
                <div className="text-sm">Per Week</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Our Weekly Music Service?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the benefits of consistent, professional entertainment for your venue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mb-2">{benefit.icon}</div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Performance Schedule
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Consistent entertainment throughout the week to keep your venue lively
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { day: "Wednesday", time: "7:00 PM - 10:00 PM", type: "Acoustic Sets" },
              { day: "Friday", time: "8:00 PM - 11:00 PM", type: "Full Band" },
              { day: "Saturday", time: "8:00 PM - 12:00 AM", type: "Feature Artists" }
            ].map((schedule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-900 dark:text-blue-300">{schedule.day}</CardTitle>
                    <Badge variant="secondary" className="bg-blue-600 text-white">{schedule.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{schedule.time}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Venue?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join venues across the region who trust us for consistent, quality entertainment
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Book Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Chat Component */}
      <ServiceChat
        serviceName="Weekly Live Music Arrangement"
        serviceDescription="Arrangement of various artists for three days a week i.e. Wednesday, Friday and Saturday. Our weekly live music arrangement service provides high-quality performers for your venue on a consistent schedule. We handle artist selection, scheduling, and all logistics to ensure smooth performances on Wednesdays, Fridays, and Saturdays. Each artist is carefully vetted to match your venue's atmosphere and audience preferences."
      />
    </Layout>
  );
}