import { Layout } from '@/components/layout/layout';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface ServiceDetailProps {
  title: string;
  description: string;
  image: string;
  features: string[];
  benefits: string[];
  faqs?: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  icon: React.ReactNode;
}

export function ServiceDetailLayout({
  title,
  description,
  image,
  features,
  benefits,
  faqs = [],
  ctaText = "Book This Service",
  ctaLink = "/contact",
  icon
}: ServiceDetailProps) {
  return (
    <Layout>
      <Helmet>
        <title>{title} | ReArt Events</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/services">
            <Button 
              variant="outline" 
              size="sm"
              className="mb-8 bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="bg-accent/90 text-white p-4 rounded-full shadow-[0_0_15px_rgba(120,120,255,0.5)]">
              {icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl"
          >
            {description}
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Features</h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Benefits</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-800">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="py-6"
                >
                  <h3 className="text-xl font-semibold mb-3 text-white">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-accent/10 to-gray-900/80 p-12 rounded-2xl border border-accent/20 shadow-lg backdrop-blur-sm">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Contact us today to discuss how our {title.toLowerCase()} service can benefit your business.
              </p>
              <Link href={ctaLink}>
                <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-7 rounded-xl" size="lg">
                  {ctaText}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}