import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { ServiceChat } from '@/components/chat/service-chat';
import { motion } from 'framer-motion';
import { Lightbulb, Users, Palette, Zap, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EventConceptsPage() {
  const features = [
    "Custom theme development and design",
    "Crowd-engaging event concepts",
    "Monthly themed experiences",
    "Interactive element integration",
    "Venue transformation planning",
    "Complete event coordination"
  ];

  const conceptTypes = [
    {
      icon: <Palette className="h-6 w-6 text-blue-600" />,
      title: "Themed Experiences",
      description: "Immersive environments that transport guests to different worlds"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Interactive Events",
      description: "Engaging activities that encourage participation and connection"
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Unique Concepts",
      description: "One-of-a-kind experiences tailored to your audience"
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: "Seasonal Themes",
      description: "Concepts that celebrate holidays, seasons, and special occasions"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Monthly Event Concepts & Management | ReArt Events</title>
        <meta name="description" content="Creative event concept development and management. Monthly themed experiences with crowd-engaging ideas tailored to your venue and audience." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-emerald-600 text-white">Creative Event Service</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Event <span className="text-emerald-400">Concepts & Management</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform ordinary gatherings into extraordinary experiences with our innovative 
              event concepts and comprehensive management services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Planning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                View Concept Gallery
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
                Creative Event Experiences
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our event concept and management service takes your events to the next level. 
                We develop unique, crowd-engaging themes and experiences tailored to your audience 
                and venue, handling everything from concept development to execution.
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
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Event planning and concepts"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">Monthly</div>
                <div className="text-sm">Concepts</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Concept Types Grid */}
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
              Types of Event Concepts We Create
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From immersive themes to interactive experiences, we bring creativity to every event
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conceptTypes.map((type, index) => (
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

      {/* Sample Concepts */}
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
              Sample Event Concepts
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get inspired by some of our most successful event concepts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Retro Disco Fever",
                theme: "70s & 80s Nostalgia",
                description: "Transform your venue into a groovy disco with vintage decorations, classic hits, and retro lighting effects."
              },
              {
                title: "Enchanted Garden",
                theme: "Nature & Fantasy",
                description: "Create a magical outdoor atmosphere indoors with botanical elements, fairy lights, and acoustic performances."
              },
              {
                title: "Neon Night",
                theme: "Futuristic Vibes",
                description: "High-energy electronic music event with LED installations, glow accessories, and modern visual effects."
              }
            ].map((concept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-emerald-900 dark:text-emerald-300">{concept.title}</CardTitle>
                    <Badge variant="secondary" className="bg-emerald-600 text-white w-fit">{concept.theme}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{concept.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Let us transform your vision into an unforgettable event experience
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Discuss Your Vision
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                View Past Events
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Chat Component */}
      <ServiceChat
        serviceName="Monthly Event Concepts/Management"
        serviceDescription="Quality focus will be on crowd-engaging event ideas/concepts every month on basis of proper theme. Our event concept and management service develops unique, crowd-engaging themes and experiences tailored to your audience and venue. From concept development to execution, we handle all aspects including themed decor, special performances, and interactive elements to ensure memorable experiences for your guests."
      />
    </Layout>
  );
}