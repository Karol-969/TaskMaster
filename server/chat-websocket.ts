import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';
import OpenAI from 'openai';

// Initialize OpenAI with error handling for missing API key
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-') {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (error) {
  console.warn('OpenAI initialization failed, using fallback responses');
}

interface Message {
  type: 'user' | 'admin' | 'ai';
  content: string;
  timestamp: string;
  conversationId?: number;
}

export class ChatWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, { conversationId?: number }> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws',
      verifyClient: (info) => {
        console.log('WebSocket connection attempt from:', info.origin);
        return true;
      }
    });

    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection established');
      this.clients.set(ws, {});

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString()) as Message;
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            content: 'Failed to process message'
          }));
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'system',
        content: 'Connected to ReArt Events chat support'
      }));
    });
  }

  private async handleMessage(ws: WebSocket, message: Message) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    try {
      // Create or get conversation
      let conversationId = clientInfo.conversationId;
      if (!conversationId) {
        conversationId = await this.createConversation();
        clientInfo.conversationId = conversationId;
        this.clients.set(ws, clientInfo);
      }

      // Save user message
      await this.saveMessage(conversationId, 'user', message.content);

      // Generate AI response if OpenAI is available
      let aiResponse: string;
      if (openai) {
        aiResponse = await this.generateAIResponse(message.content, conversationId);
      } else {
        aiResponse = this.getFallbackResponse(message.content);
      }

      // Save AI response
      await this.saveMessage(conversationId, 'admin', aiResponse);

      // Send response back to client
      ws.send(JSON.stringify({
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        conversationId
      }));

    } catch (error) {
      console.error('Error in message handling:', error);
      ws.send(JSON.stringify({
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.'
      }));
    }
  }

  private async createConversation(): Promise<number> {
    try {
      const conversation = await storage.createConversation({
        userId: null,
        title: 'Chat Support',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return conversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  private async saveMessage(conversationId: number, sender: string, content: string) {
    try {
      await storage.createMessage({
        conversationId,
        sender,
        content,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  private async generateAIResponse(userMessage: string, conversationId: number): Promise<string> {
    if (!openai) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      // Get conversation history for context
      const messages = await storage.getConversationMessages(conversationId);
      const recentMessages = messages.slice(-10); // Last 10 messages for context

      // Prepare messages for OpenAI
      const openaiMessages = [
        {
          role: 'system' as const,
          content: `You are a helpful customer service assistant for ReArt Events, a comprehensive event management platform in Nepal. 

ReArt Events offers:
- Artist booking services (folk, pop, electronic musicians)
- Sound equipment rental (PA systems, wireless mics, lighting)
- Venue booking and management
- Event planning and coordination
- Influencer collaboration services

Be helpful, professional, and knowledgeable about our services. Provide specific information about pricing, availability, and booking processes. Always maintain a friendly tone and offer to help with any event-related needs.

If asked about services we don't offer, politely redirect to our available services. For complex bookings, suggest they use our booking forms on the website or contact our team directly.`
        },
        ...recentMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: userMessage
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('artist') || lowerMessage.includes('musician')) {
      return "We have talented artists available for booking including folk, pop, and electronic musicians. You can browse our artist catalog and make bookings through our website. Would you like me to help you find the right artist for your event?";
    }
    
    if (lowerMessage.includes('sound') || lowerMessage.includes('equipment') || lowerMessage.includes('audio')) {
      return "We offer professional sound equipment rental including PA systems, wireless microphones, and lighting packages. Our equipment is suitable for events of all sizes from intimate gatherings to large festivals. Would you like information about our sound packages?";
    }
    
    if (lowerMessage.includes('venue') || lowerMessage.includes('location')) {
      return "We can help you find the perfect venue for your event. We work with various venues across Nepal including heritage halls, modern event centers, and outdoor spaces. What type of event are you planning?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('booking')) {
      return "Our pricing varies based on your specific needs. For accurate pricing and availability, please use our booking forms on the website or contact our team directly. We offer competitive rates for all our services including artists, sound equipment, and venues.";
    }
    
    if (lowerMessage.includes('event') || lowerMessage.includes('planning')) {
      return "We're a full-service event management company offering artist booking, sound equipment rental, venue coordination, and event planning services. We can help make your event successful from start to finish. What type of event are you planning?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Welcome to ReArt Events. I'm here to help you with all your event needs including artist booking, sound equipment rental, and venue coordination. How can I assist you today?";
    }
    
    return "Thank you for contacting ReArt Events! We specialize in event management services including artist booking, sound equipment rental, and venue coordination. How can I help you plan your perfect event today?";
  }
}