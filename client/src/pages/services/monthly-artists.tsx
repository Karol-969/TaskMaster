import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { ServiceChat } from '@/components/chat/service-chat';
import { motion } from 'framer-motion';
import { Star, Calendar, Globe, Trophy, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MonthlyArtistsPage() {
  const features = [
    "Curated selection of renowned artists",
    "Monthly featured performances",
    "International and local talent",
    "Complete event production",
    "VIP meet-and-greet arrangements",
    "Custom staging and sound setup"
  ];

  const artistTypes = [
    {
      icon: <Star className="h-6 w-6 text-blue-600" />,
      title: "Headliner Artists",
      description: "Internationally recognized performers and chart-topping musicians"
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: "Cultural Performers",
      description: "Traditional and contemporary artists representing diverse cultures"
    },
    {
      icon: <Trophy className="h-6 w-6 text-blue-600" />,
      title: "Award Winners",
      description: "Grammy nominees, festival winners, and critically acclaimed artists"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Emerging Talent",
      description: "Rising stars and breakthrough artists making waves in the industry"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Monthly Artist Arrangement | ReArt Events</title>
        <meta name="description" content="Book renowned artists monthly for exclusive performances. From international headliners to emerging talent, we arrange memorable musical experiences." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-purple-600 text-white">Premium Artist Service</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Monthly <span className="text-purple-400">Artist Arrangement</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Bring world-class artists to your venue with our exclusive monthly booking service. 
              From international headliners to breakthrough performers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Book Featured Artist
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                View Artist Roster
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
                Exclusive Monthly Performances
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our monthly artist arrangement service connects you with exceptional performers 
                who can transform your venue into a premier entertainment destination. We handle 
                negotiations, logistics, and production to ensure each performance exceeds expectations.
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
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Concert performance"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">Monthly</div>
                <div className="text-sm">Exclusives</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Artist Types Grid */}
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
              Artist Categories We Represent
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From chart-toppers to cultural icons, we bring diverse talent to your stage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artistTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mb-2">{type.icon}</div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{type.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our Booking Process
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From consultation to show night, we handle every detail
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Consultation", desc: "Understand your vision and audience" },
              { step: "02", title: "Artist Selection", desc: "Curate perfect performers for your event" },
              { step: "03", title: "Production", desc: "Handle all technical and logistical needs" },
              { step: "04", title: "Performance", desc: "Deliver an unforgettable experience" }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{process.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{process.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Next Headliner?
            </h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Let us connect you with world-class artists who will elevate your venue's reputation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Booking Process
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                View Available Artists
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Chat Component */}
      <ServiceChat
        serviceName="Monthly Artist Arrangement"
        serviceDescription="Arrangement of various renowned artists on monthly basis. Our monthly artist arrangement service connects you with exceptional performers including international headliners, cultural artists, award winners, and emerging talent. We handle all aspects from artist selection and negotiations to production and logistics, ensuring world-class performances that elevate your venue's reputation and provide unforgettable experiences for your audience."
      />
    </Layout>
  );
}