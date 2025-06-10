import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, Plus, Send, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Helmet } from "react-helmet";

interface Conversation {
  id: number;
  userId: number;
  subject: string;
  status: string;
  adminId: number | null;
  createdAt: string;
  updatedAt: string;
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

const newConversationSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(1, "Message is required").max(1000, "Message too long")
});

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof newConversationSchema>>({
    resolver: zodResolver(newConversationSchema),
    defaultValues: {
      subject: "",
      message: ""
    }
  });

  // Get user conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
  });

  // Get messages for selected conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
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
        // Authenticate and join conversation
        ws.send(JSON.stringify({
          type: 'auth',
          userId: 1, // This should come from auth context
          userRole: 'user'
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

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof newConversationSchema>) => {
      return apiRequest('/api/conversations', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setSelectedConversation(conversation.id);
      setIsNewConversationOpen(false);
      form.reset();
    }
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/conversations', selectedConversation, 'messages']
      });
      setNewMessage("");
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

  return (
    <>
      <Helmet>
        <title>Chat Support - ReArt Events</title>
        <meta name="description" content="Get real-time support from our team. Contact us for event management, artist booking, and all your event needs." />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
                Chat Support
              </h1>
              <p className="text-gray-400 mt-2">Get real-time help from our support team</p>
            </div>
            
            <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Conversation
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Start New Conversation</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createConversationMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Subject</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="What do you need help with?"
                              className="bg-gray-800 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Describe your question or issue..."
                              className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={createConversationMutation.isPending}
                    >
                      {createConversationMutation.isPending ? "Creating..." : "Start Conversation"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                    Conversations
                    {isConnected && (
                      <Badge variant="outline" className="ml-auto text-green-400 border-green-400">
                        Connected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {conversationsLoading ? (
                    <div className="p-4 text-center text-gray-400">Loading conversations...</div>
                  ) : conversations?.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No conversations yet. Start a new one!
                    </div>
                  ) : (
                    <div className="space-y-2 p-4 max-h-[500px] overflow-y-auto">
                      {conversations?.map((conv: Conversation) => (
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
                            <h3 className="font-medium text-white truncate">{conv.subject}</h3>
                            <Badge className={`${getStatusColor(conv.status)} text-white text-xs`}>
                              {conv.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(conv.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-700 h-full flex flex-col">
                {selectedConversation ? (
                  <>
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-white">
                        {conversations?.find((c: Conversation) => c.id === selectedConversation)?.subject}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-4 overflow-y-auto">
                      {messagesLoading ? (
                        <div className="text-center text-gray-400">Loading messages...</div>
                      ) : (
                        <div className="space-y-4">
                          {messages?.map((msg: ChatMessage) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  msg.senderType === 'user'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-white'
                                }`}
                              >
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
                          placeholder="Type your message..."
                          className="flex-1 bg-gray-800 border-gray-600 text-white"
                          disabled={sendMessageMutation.isPending}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}