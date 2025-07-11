import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './database-storage';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  userRole?: string;
  conversationId?: number;
}

interface ChatMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'typing' | 'stop_typing' | 'auth' | 'join_conversation';
  conversationId?: number;
  senderId?: number;
  senderType?: 'user' | 'admin';
  message?: string;
  timestamp?: Date;
  userId?: number;
  userRole?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

class ChatWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<number, AuthenticatedWebSocket[]> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/chat'
    });

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: AuthenticatedWebSocket, request: any) {
    console.log('New WebSocket connection');

    ws.on('message', async (data: string) => {
      try {
        const message: ChatMessage = JSON.parse(data);
        await this.handleMessage(ws, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format' 
        }));
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private async handleMessage(ws: AuthenticatedWebSocket, message: ChatMessage) {
    switch (message.type) {
      case 'auth':
        await this.handleAuth(ws, message);
        break;
      case 'join_conversation':
        await this.handleJoinConversation(ws, message);
        break;
      case 'message':
        await this.handleChatMessage(ws, message);
        break;
      case 'typing':
        this.handleTyping(ws, message);
        break;
      case 'stop_typing':
        this.handleStopTyping(ws, message);
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  private async handleAuth(ws: AuthenticatedWebSocket, message: any) {
    try {
      const { userId, userRole } = message;
      
      if (!userId) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'User ID required'
        }));
        return;
      }

      const user = await storage.getUser(userId);
      if (!user) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'User not found'
        }));
        return;
      }

      ws.userId = userId;
      ws.userRole = user.role;

      ws.send(JSON.stringify({
        type: 'auth_success',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }));

    } catch (error) {
      console.error('Auth error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication failed'
      }));
    }
  }

  private async handleJoinConversation(ws: AuthenticatedWebSocket, message: any) {
    try {
      const { conversationId } = message;
      
      if (!ws.userId || !conversationId) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Authentication and conversation ID required'
        }));
        return;
      }

      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Conversation not found'
        }));
        return;
      }

      // Check if user has access to this conversation
      const hasAccess = conversation.userId === ws.userId || 
                       conversation.adminId === ws.userId ||
                       ws.userRole === 'admin';

      if (!hasAccess) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Access denied'
        }));
        return;
      }

      ws.conversationId = conversationId;

      // Add to conversation clients
      if (!this.clients.has(conversationId)) {
        this.clients.set(conversationId, []);
      }
      this.clients.get(conversationId)!.push(ws);

      // Get conversation messages
      const messages = await storage.getConversationMessages(conversationId);

      ws.send(JSON.stringify({
        type: 'conversation_joined',
        conversationId,
        messages
      }));

      // Notify other clients in the conversation
      this.broadcastToConversation(conversationId, {
        type: 'user_joined',
        user: {
          id: ws.userId,
          username: '', // Will be filled from user data
          role: ws.userRole || 'user'
        }
      }, ws.userId);

    } catch (error) {
      console.error('Join conversation error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to join conversation'
      }));
    }
  }

  private async handleChatMessage(ws: AuthenticatedWebSocket, message: ChatMessage) {
    try {
      if (!ws.userId || !ws.conversationId || !message.message) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message data'
        }));
        return;
      }

      // Save message to database
      const senderString = ws.userRole === 'admin' ? `admin:${ws.userId}` : `user:${ws.userId}`;
      const chatMessage = await storage.createChatMessage({
        conversationId: ws.conversationId,
        sender: senderString,
        content: message.message
      });

      // Broadcast message to all clients in the conversation
      this.broadcastToConversation(ws.conversationId, {
        type: 'message',
        conversationId: ws.conversationId,
        senderId: ws.userId,
        senderType: ws.userRole === 'admin' ? 'admin' : 'user',
        message: message.message,
        timestamp: chatMessage.createdAt || new Date()
      });

    } catch (error) {
      console.error('Chat message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to send message'
      }));
    }
  }

  private handleTyping(ws: AuthenticatedWebSocket, message: ChatMessage) {
    if (!ws.conversationId || !ws.userId) return;

    this.broadcastToConversation(ws.conversationId, {
      type: 'typing',
      senderId: ws.userId,
      senderType: ws.userRole === 'admin' ? 'admin' : 'user'
    }, ws.userId);
  }

  private handleStopTyping(ws: AuthenticatedWebSocket, message: ChatMessage) {
    if (!ws.conversationId || !ws.userId) return;

    this.broadcastToConversation(ws.conversationId, {
      type: 'stop_typing',
      senderId: ws.userId,
      senderType: ws.userRole === 'admin' ? 'admin' : 'user'
    }, ws.userId);
  }

  private handleDisconnection(ws: AuthenticatedWebSocket) {
    if (ws.conversationId && ws.userId) {
      // Remove from conversation clients
      const clients = this.clients.get(ws.conversationId);
      if (clients) {
        const index = clients.indexOf(ws);
        if (index > -1) {
          clients.splice(index, 1);
        }

        // Notify other clients
        this.broadcastToConversation(ws.conversationId, {
          type: 'user_left',
          user: {
            id: ws.userId,
            username: '',
            role: ws.userRole || 'user'
          }
        }, ws.userId);
      }
    }
  }

  private broadcastToConversation(conversationId: number, message: ChatMessage, excludeUserId?: number) {
    const clients = this.clients.get(conversationId);
    if (!clients) return;

    const messageStr = JSON.stringify(message);
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && 
          (!excludeUserId || client.userId !== excludeUserId)) {
        client.send(messageStr);
      }
    });
  }

  public getConnectedUsers(conversationId: number): number[] {
    const clients = this.clients.get(conversationId);
    if (!clients) return [];

    return clients
      .filter(client => client.readyState === WebSocket.OPEN && client.userId)
      .map(client => client.userId!);
  }
}

export { ChatWebSocketServer };