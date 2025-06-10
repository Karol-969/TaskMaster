import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Clock, CheckCircle2, XCircle, User, Users } from "lucide-react";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/admin-layout";

interface Conversation {
  id: number;
  userId: number;
  subject: string;
  status: string;
  adminId: number | null;
  guestName?: string;
  guestEmail?: string | null;
  lastMessageAt: string;
  createdAt: string;
}

interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: 'user' | 'admin';
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface WSMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'typing' | 'stop_typing' | 'auth' | 'join_conversation';
  conversationId?: number;
  senderId?: number;
  senderType?: 'user' | 'admin';
  message?: string;
  timestamp?: Date;
  userId?: number;
  userRole?: string;
}

export default function AdminChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Get all conversations (admin view)
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/admin/conversations'],
  });

  // Get messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/conversations', selectedConversation, 'messages'],
    enabled: !!selectedConversation,
  });

  // WebSocket connection
  useEffect(() => {
    if (selectedConversation) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}`);

      ws.onopen = () => {
        setIsConnected(true);
        // Authenticate as admin and join conversation
        ws.send(JSON.stringify({
          type: 'auth',
          userId: 1, // This should come from admin auth context
          userRole: 'admin'
        }));
        
        ws.send(JSON.stringify({
          type: 'join_conversation',
          conversationId: selectedConversation
        }));
      };

      ws.onmessage = (event) => {
        const message: WSMessage = JSON.parse(event.data);
        if (message.type === 'message' && message.conversationId === selectedConversation) {
          // Refresh messages when new message received
          queryClient.invalidateQueries({
            queryKey: ['/api/conversations', selectedConversation, 'messages']
          });
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [selectedConversation, queryClient]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/conversations', selectedConversation, 'messages']
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/admin/conversations']
      });
      setNewMessage("");
    }
  });

  // Update conversation status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ conversationId, status }: { conversationId: number; status: string }) => {
      return apiRequest(`/api/admin/conversations/${conversationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/conversations'] });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStatusChange = (status: string) => {
    if (selectedConversation) {
      updateStatusMutation.mutate({ conversationId: selectedConversation, status });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const selectedConv = conversations.find((c: Conversation) => c.id === selectedConversation);

  return (
    <>
      <Helmet>
        <title>Chat Management - Admin Panel</title>
        <meta name="description" content="Manage customer support conversations and provide real-time assistance." />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Chat Management</h1>
              <p className="text-gray-400 mt-1">Manage customer support conversations</p>
            </div>
            {isConnected && (
              <Badge variant="outline" className="text-green-400 border-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    Conversations ({conversations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {conversationsLoading ? (
                    <div className="p-4 text-center text-gray-400">Loading conversations...</div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No conversations yet
                    </div>
                  ) : (
                    <div className="space-y-2 p-4 max-h-[500px] overflow-y-auto">
                      {conversations.map((conv: Conversation) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation === conv.id
                              ? 'bg-purple-600'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white truncate">#{conv.id} - {conv.subject}</h3>
                            <Badge className={`${getStatusColor(conv.status)} text-white text-xs`}>
                              {conv.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <User className="w-3 h-3 mr-1" />
                            {conv.userId === 0 ? conv.guestName || 'Anonymous' : `User ID: ${conv.userId}`}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(conv.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-700 h-full flex flex-col">
                {selectedConversation && selectedConv ? (
                  <>
                    <CardHeader className="border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">
                            #{selectedConv.id} - {selectedConv.subject}
                          </CardTitle>
                          <p className="text-sm text-gray-400">
                            {selectedConv.userId === 0 ? selectedConv.guestName || 'Anonymous User' : `User ID: ${selectedConv.userId}`} | Created: {formatDate(selectedConv.createdAt)}
                          </p>
                        </div>
                        <Select 
                          value={selectedConv.status} 
                          onValueChange={handleStatusChange}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-4 overflow-y-auto">
                      {messagesLoading ? (
                        <div className="text-center text-gray-400">Loading messages...</div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg: ChatMessage) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  msg.senderType === 'admin'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-white'
                                }`}
                              >
                                <div className="flex items-center mb-1">
                                  <span className="text-xs opacity-70">
                                    {msg.senderType === 'admin' ? 'Admin' : `User ${msg.senderId}`}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {formatTime(msg.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </CardContent>

                    <div className="p-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your response..."
                          className="flex-1 bg-gray-800 border-gray-600 text-white"
                          disabled={sendMessageMutation.isPending || selectedConv.status === 'closed'}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending || selectedConv.status === 'closed'}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      {selectedConv.status === 'closed' && (
                        <p className="text-xs text-gray-400 mt-2">
                          This conversation is closed. Change status to continue chatting.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a conversation to start responding</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}