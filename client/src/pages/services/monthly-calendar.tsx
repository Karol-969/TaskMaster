import { Calendar } from 'lucide-react';
import { ServiceDetailLayout } from '@/components/services/service-detail-layout';

export default function MonthlyCalendarService() {
  return (
    <ServiceDetailLayout
      title="Working on Monthly Calendar Basis"
      description="Our monthly calendar service provides a structured approach to your venue's entertainment needs. We create a comprehensive monthly plan with dedicated artists who are auditioned and confirmed in advance."
      image="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80"
      icon={<Calendar className="h-10 w-10 text-accent" />}
      features={[
        "Dedicated artists arranged for the entire month on a calendar basis",
        "Professional audition process to ensure quality performers",
        "Comprehensive monthly schedule planning",
        "Artist biographical materials and promotional content",
        "Detailed performance schedules with technical requirements",
        "Regular progress meetings and performance reviews"
      ]}
      benefits={[
        "Long-term planning stability for your venue",
        "Consistent quality assurance through audition process",
        "Stronger promotional opportunities with advance scheduling",
        "Better artist-venue relationship with longer engagements",
        "Simplified administration with monthly planning cycles",
        "Ability to build customer loyalty with regular performers"
      ]}
      faqs={[
        {
          question: "How far in advance do you plan the monthly calendar?",
          answer: "We typically plan our monthly calendars 4-6 weeks in advance to ensure proper auditions, scheduling, and promotional time. This gives venues ample opportunity to market upcoming performances."
        },
        {
          question: "Can we make changes to the calendar once it's established?",
          answer: "While we aim to maintain consistency, we understand that adjustments may be necessary. We can accommodate reasonable changes with sufficient notice, though last-minute alterations may incur additional coordination fees."
        },
        {
          question: "How do you select artists for monthly arrangements?",
          answer: "Our selection process includes live auditions, portfolio reviews, and audience feedback analysis. We evaluate artists based on performance quality, professionalism, reliability, and suitability for your venue's specific atmosphere and customer preferences."
        },
        {
          question: "What marketing materials do you provide for scheduled artists?",
          answer: "We provide professional artist bios, high-quality photos, sample audio/video clips, and promotional write-ups that you can use across your marketing channels to promote upcoming performances."
        }
      ]}
      ctaText="Plan Your Monthly Calendar"
    />
  );
}