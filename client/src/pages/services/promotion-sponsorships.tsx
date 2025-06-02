import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { ServiceChat } from '@/components/chat/service-chat';
import { motion } from 'framer-motion';
import { Megaphone, TrendingUp, Target, Handshake, CheckCircle, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PromotionSponsorshipsPage() {
  const features = [
    "Multi-platform digital marketing campaigns",
    "Physical advertising and promotions",
    "Sponsorship identification and outreach",
    "Partnership negotiation and management",
    "Brand alignment and integrity maintenance",
    "Performance tracking and analytics"
  ];

  const serviceTypes = [
    {
      icon: <Megaphone className="h-6 w-6 text-blue-600" />,
      title: "Digital Promotion",
      description: "Social media campaigns, online advertising, and content marketing"
    },
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Physical Marketing",
      description: "Print materials, outdoor advertising, and on-site promotions"
    },
    {
      icon: <Handshake className="h-6 w-6 text-blue-600" />,
      title: "Sponsorship Deals",
      description: "Corporate partnerships and sponsor relationship management"
    },
    {
      icon: <BarChart className="h-6 w-6 text-blue-600" />,
      title: "Performance Analytics",
      description: "Campaign tracking, ROI analysis, and strategic optimization"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Promotion and Sponsorships | ReArt Events</title>
        <meta name="description" content="Comprehensive promotion and sponsorship services. Digital and physical marketing campaigns plus strategic partnership management for maximum event success." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-900 via-red-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-orange-600 text-white">Marketing & Partnerships</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Promotion & <span className="text-orange-400">Sponsorships</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Maximize your event's reach and financial success with comprehensive marketing 
              strategies and strategic sponsorship partnerships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Launch Campaign
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                View Case Studies
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
                Strategic Marketing & Partnerships
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our promotion and sponsorship service helps maximize your event's reach and 
                financial success. We develop comprehensive marketing strategies across digital 
                and physical platforms while identifying and securing relevant sponsorship 
                opportunities that benefit all parties involved.
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
                src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                alt="Marketing and promotion"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">360°</div>
                <div className="text-sm">Marketing</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Types Grid */}
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
              Our Promotion & Sponsorship Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive marketing solutions and partnership management for event success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTypes.map((type, index) => (
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

      {/* Marketing Channels */}
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
              Marketing Channels We Utilize
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Multi-platform approach for maximum reach and engagement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-300 flex items-center">
                    <Megaphone className="h-6 w-6 mr-2" />
                    Digital Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Social media campaigns (Facebook, Instagram, Twitter)",
                    "Google Ads and search engine marketing",
                    "Email marketing and newsletters",
                    "Content marketing and blogging",
                    "Influencer partnerships"
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{channel}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-900 dark:text-orange-300 flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    Physical Marketing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Print advertisements and flyers",
                    "Billboard and outdoor advertising",
                    "Radio and local media partnerships",
                    "On-site promotional materials",
                    "Direct mail campaigns"
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{channel}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsorship Benefits */}
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
              Sponsorship Partnership Benefits
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Creating mutually beneficial relationships between events and sponsors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Brand Exposure",
                description: "Prominent logo placement, mentions, and brand integration throughout the event",
                benefits: ["Logo on promotional materials", "Stage announcements", "Social media features"]
              },
              {
                title: "Target Audience Access",
                description: "Direct connection with engaged audience segments aligned with sponsor demographics",
                benefits: ["Demographic insights", "Audience engagement", "Lead generation"]
              },
              {
                title: "Content Opportunities",
                description: "Professional content creation and media coverage for sponsor marketing use",
                benefits: ["Event photography", "Video content", "Social media posts"]
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                    <div className="space-y-2">
                      {benefit.benefits.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Amplify Your Event's Success?
            </h2>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Let us create a comprehensive marketing strategy and secure valuable partnerships for your event
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Start Marketing Plan
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Explore Sponsorship Options
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Chat Component */}
      <ServiceChat
        serviceName="Promotion and Sponsorships"
        serviceDescription="Promoting the business on both digital and physical platform along-side handling sponsorship deals. Our promotion and sponsorship service helps maximize your event's reach and financial success through comprehensive marketing strategies across digital and physical platforms. We identify and secure relevant sponsorship opportunities, negotiate deals that benefit both your event and sponsors while maintaining brand integrity."
      />
    </Layout>
  );
}