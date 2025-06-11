import OpenAI from "openai";

let openai: OpenAI | null = null;

// Initialize OpenAI client only if API key is available
function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    try {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (error) {
      console.warn('Failed to initialize OpenAI client:', error);
      return null;
    }
  }
  return openai;
}

// Company information for the AI assistant
const COMPANY_CONTEXT = `
You are a helpful customer service assistant for ReArt Events Pvt. Ltd., a premium event management company established in 2024.

ABOUT REART EVENTS:
- Specializes in comprehensive event planning, artist booking, and entertainment services
- Provides sound equipment rental and technical support
- Manages venue bookings and event coordination
- Offers influencer collaborations and marketing services

SERVICES WE PROVIDE:
1. ARTIST MANAGEMENT & BOOKING
   - Professional artists across multiple genres (Folk, Pop, Rock, Classical, Electronic, Hip-Hop, Jazz)
   - Live performance coordination
   - Artist scheduling and contract management

2. SOUND EQUIPMENT RENTAL
   - Professional PA systems (Small, Medium, Large venue setups)
   - Microphones, speakers, and audio mixing equipment
   - Technical support and setup services
   - Power ratings from 500W to 5000W
   - Coverage areas from 50 to 2000+ people

3. EVENT MANAGEMENT
   - Complete event planning and coordination
   - Venue selection and booking assistance
   - Timeline management and logistics
   - Corporate events, weddings, concerts, and private parties

4. VENUE MANAGEMENT
   - Partnership with premium venues
   - Capacity planning and space optimization
   - Booking coordination and scheduling

5. INFLUENCER SERVICES
   - Social media influencer partnerships
   - Brand collaboration and marketing
   - Event promotion and digital marketing

RESPONSE GUIDELINES:
- Be friendly, professional, and knowledgeable about our services
- Provide specific information about pricing, availability, and booking processes
- If asked about services we don't provide, politely redirect to what we do offer
- For complex requests requiring human intervention, suggest connecting with our team
- Always maintain a helpful and solution-oriented tone
- Include contact information when appropriate
- If the user wants to speak to a human, acknowledge this and let them know an admin will be connected

CONTACT INFO:
- Email: info@reartevents.com
- Phone: Available upon request
- Location: Based in Nepal, serving nationwide

Remember: You represent ReArt Events professionally. Be helpful, informative, and always try to understand how we can assist with their event needs.
`;

export async function generateAIResponse(userMessage: string, conversationHistory?: string): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    console.warn('OpenAI API key not available, falling back to default response');
    return "Thank you for your message! I'm currently experiencing technical difficulties with the AI assistant. Please contact our team directly at info@reartevents.com or use the Human Support option for immediate assistance with your event planning needs.";
  }

  try {
    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: COMPANY_CONTEXT
      }
    ];

    if (conversationHistory) {
      messages.push({
        role: "user",
        content: `Previous conversation context: ${conversationHistory}`
      });
    }

    messages.push({
      role: "user",
      content: userMessage
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team directly.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm currently experiencing technical difficulties. Please contact our team directly at info@reartevents.com for immediate assistance.";
  }
}

export function detectHumanRequest(message: string): boolean {
  const humanKeywords = [
    'human', 'person', 'real person', 'speak to someone', 'talk to human',
    'customer service', 'representative', 'agent', 'support team',
    'speak to admin', 'connect me', 'transfer me', 'escalate'
  ];
  
  const lowerMessage = message.toLowerCase();
  return humanKeywords.some(keyword => lowerMessage.includes(keyword));
}