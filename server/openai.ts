import OpenAI from "openai";
import { storage } from './storage';

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

PRICING INFORMATION:
Note: All pricing information below will be supplemented with real-time data from our database when users ask specific questions. Always provide the most current pricing and availability information.

RESPONSE GUIDELINES:
- Be friendly, professional, and knowledgeable about our services
- Provide specific pricing information when asked about any equipment or services
- Always mention that final pricing may vary based on event requirements, duration, and specific needs
- For exact quotes, direct users to contact our team or use the booking system on our website
- Include contact information when appropriate
- If the user wants to speak to a human, acknowledge this and let them know an admin will be connected

CONTACT INFO:
- Email: info@reartevents.com
- Phone: Available upon request
- Location: Based in Nepal, serving nationwide

Remember: You represent ReArt Events professionally. Be helpful, informative, and always try to understand how we can assist with their event needs.

IMPORTANT: When users ask about specific pricing, availability, or details about our services, you should provide the most current information from our database.
`;

// Real-time data fetching functions
async function getCurrentSoundEquipmentData(): Promise<string> {
  try {
    const soundSystems = await storage.getAllSoundSystems();
    if (soundSystems.length === 0) return "No sound equipment currently available.";
    
    return soundSystems.map(system => 
      `${system.name} - ${system.pricing} (${system.powerRating}, ${system.coverageArea}) - ${system.available ? 'Available' : 'Not Available'}`
    ).join('\n');
  } catch (error) {
    return "Unable to fetch current sound equipment data.";
  }
}

async function getCurrentInfluencersData(): Promise<string> {
  try {
    const influencers = await storage.getAllInfluencers();
    if (influencers.length === 0) return "No influencers currently available.";
    
    return influencers.map(inf => 
      `${inf.name} - Post: NPR ${inf.postPrice}, Story: NPR ${inf.storyPrice || 'N/A'}, Video: NPR ${inf.videoPrice || 'N/A'} (${inf.instagramFollowers} followers) - ${inf.isActive ? 'Available' : 'Not Available'}`
    ).join('\n');
  } catch (error) {
    return "Unable to fetch current influencer data.";
  }
}

async function getCurrentArtistsData(): Promise<string> {
  try {
    const artists = await storage.getAllArtists();
    if (artists.length === 0) return "No artists currently available.";
    
    return artists.map(artist => 
      `${artist.name} - ${artist.genre} genre, Languages: ${artist.languages} - ${artist.isActive ? 'Available for booking' : 'Not Available'}`
    ).join('\n');
  } catch (error) {
    return "Unable to fetch current artist data.";
  }
}

async function getRealTimeContextData(userMessage: string): Promise<string> {
  const lowerMessage = userMessage.toLowerCase();
  let contextData = "";
  
  // Check what type of information the user is asking for
  if (lowerMessage.includes('sound') || lowerMessage.includes('equipment') || lowerMessage.includes('audio') || lowerMessage.includes('pa system')) {
    const soundData = await getCurrentSoundEquipmentData();
    contextData += `\n\nCURRENT SOUND EQUIPMENT:\n${soundData}`;
  }
  
  if (lowerMessage.includes('influencer') || lowerMessage.includes('social media') || lowerMessage.includes('marketing')) {
    const influencerData = await getCurrentInfluencersData();
    contextData += `\n\nCURRENT INFLUENCERS:\n${influencerData}`;
  }
  
  if (lowerMessage.includes('artist') || lowerMessage.includes('musician') || lowerMessage.includes('performer') || lowerMessage.includes('singer')) {
    const artistData = await getCurrentArtistsData();
    contextData += `\n\nCURRENT ARTISTS:\n${artistData}`;
  }
  
  // If asking for general pricing or "everything", fetch all data
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('all') || lowerMessage.includes('everything') || lowerMessage.includes('list')) {
    const soundData = await getCurrentSoundEquipmentData();
    const influencerData = await getCurrentInfluencersData();
    const artistData = await getCurrentArtistsData();
    contextData = `\n\nCURRENT SOUND EQUIPMENT:\n${soundData}\n\nCURRENT INFLUENCERS:\n${influencerData}\n\nCURRENT ARTISTS:\n${artistData}`;
  }
  
  return contextData;
}

export async function generateAIResponse(userMessage: string, conversationHistory?: string): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    console.warn('OpenAI API key not available, falling back to default response');
    return "Thank you for your message! I'm currently experiencing technical difficulties with the AI assistant. To enable AI responses, please configure your OpenAI API key in the environment variables. For immediate assistance, please use the Human Support option or contact our team directly at info@reartevents.com.";
  }

  try {
    // Get real-time data based on user message
    const realTimeData = await getRealTimeContextData(userMessage);
    console.log('🔄 Real-time data fetched for AI:', realTimeData ? 'Data available' : 'No specific data needed');
    
    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: COMPANY_CONTEXT + realTimeData
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