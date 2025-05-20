import { Users } from 'lucide-react';
import { ServiceDetailLayout } from '@/components/services/service-detail-layout';

export default function EventConceptsService() {
  return (
    <ServiceDetailLayout
      title="Monthly Event Concepts/Management"
      description="Quality focus will be on crowd-engaging event ideas/concepts every month on basis of proper theme. Our event concept and management service takes your events to the next level with unique, themed experiences."
      image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"
      icon={<Users className="h-10 w-10 text-accent" />}
      features={[
        "Custom event concept development based on themes and trends",
        "Complete event management from planning to execution",
        "Crowd-engaging activities and interactive elements",
        "Unique themed decorations and atmosphere creation",
        "Professional MC and entertainment coordination",
        "Event documentation and post-event analysis"
      ]}
      benefits={[
        "Increase customer engagement and attendance with unique themed events",
        "Enhance your venue's reputation as a premier entertainment destination",
        "Create memorable experiences that drive social media sharing and word-of-mouth",
        "Attract new audience segments with targeted event concepts",
        "Generate additional revenue through special event ticketing",
        "Build a calendar of anticipated recurring themed events"
      ]}
      faqs={[
        {
          question: "How do you develop the monthly event concepts?",
          answer: "Our creative team researches current trends, seasonal themes, and your target audience preferences to develop unique event concepts that align with your venue's brand and appeal to your customers. We present multiple concepts for your review and selection."
        },
        {
          question: "What's included in the event management package?",
          answer: "Our comprehensive event management includes concept development, planning, vendor coordination, decor, technical setup, entertainment booking, on-site management during the event, and post-event analysis and reporting."
        },
        {
          question: "How far in advance should we plan a themed event?",
          answer: "For optimal results, we recommend planning themed events at least 6-8 weeks in advance. This allows sufficient time for concept development, marketing, vendor coordination, and ticket sales if applicable."
        },
        {
          question: "Can you work within our existing budget?",
          answer: "Yes, we work with a wide range of budgets and can scale concepts accordingly. During our initial consultation, we'll discuss your budget constraints and develop event concepts that deliver maximum impact within your financial parameters."
        }
      ]}
      ctaText="Plan Your Next Event"
    />
  );
}