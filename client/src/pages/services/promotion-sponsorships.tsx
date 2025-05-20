import { BarChart } from 'lucide-react';
import { ServiceDetailLayout } from '@/components/services/service-detail-layout';

export default function PromotionSponsorshipsService() {
  return (
    <ServiceDetailLayout
      title="Promotion and Sponsorships"
      description="Promoting the business on both digital and physical platforms along-side handling sponsorship deals. Our comprehensive marketing approach helps maximize your event's reach and financial success."
      image="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"
      icon={<BarChart className="h-10 w-10 text-accent" />}
      features={[
        "Comprehensive digital marketing campaigns across social media platforms",
        "Physical promotional materials including posters, flyers, and banners",
        "Strategic sponsorship outreach and partnership development",
        "Contract negotiation and sponsor relationship management",
        "Custom promotional content creation for various platforms",
        "Performance tracking and ROI analysis"
      ]}
      benefits={[
        "Increased event visibility and attendance through targeted promotion",
        "Additional revenue streams through strategic sponsorships",
        "Enhanced brand credibility through association with respected sponsors",
        "Cost reduction through sponsor contributions and in-kind exchanges",
        "Extended reach through sponsor networks and cross-promotion",
        "Professional marketing materials that elevate your event's perception"
      ]}
      faqs={[
        {
          question: "What types of businesses do you approach for sponsorships?",
          answer: "We identify potential sponsors whose brand values and target audience align with your event. This typically includes local businesses, relevant industry suppliers, media partners, and brands looking to increase visibility with your audience demographic."
        },
        {
          question: "How do you determine sponsorship packages and pricing?",
          answer: "We develop tiered sponsorship packages based on market research, your event's value proposition, audience reach, and comparable sponsorship opportunities. Packages are designed to offer clear value at different investment levels while meeting your revenue needs."
        },
        {
          question: "What digital platforms do you utilize for promotion?",
          answer: "Our digital promotion strategy typically includes Instagram, Facebook, TikTok, Twitter, LinkedIn (for B2B events), email marketing, influencer partnerships, and relevant industry websites or forums, depending on your target audience demographics."
        },
        {
          question: "How do you measure promotional campaign success?",
          answer: "We track key performance indicators including impression counts, engagement rates, click-through rates, ticket sales/registrations, website traffic, social media growth, and attendee surveys. We provide comprehensive reports with actionable insights for future improvements."
        }
      ]}
      ctaText="Boost Your Marketing"
    />
  );
}