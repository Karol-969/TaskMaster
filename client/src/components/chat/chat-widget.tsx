import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Minimize2, Bot, User, ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  message: string;
  senderType: 'user' | 'admin';
  createdAt: string;
}

interface Conversation {
  id: number;
  subject: string;
  status: string;
  messages: Message[];
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showChoiceMenu, setShowChoiceMenu] = useState(true);
  const [selectedAssistantType, setSelectedAssistantType] = useState<'ai_assistant' | 'human_support' | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = (force = false) => {
    if (!isUserScrolling || force) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setIsUserScrolling(false);
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50; // 50px threshold
      setIsUserScrolling(!isAtBottom);
    }
  };

  useEffect(() => {
    if (conversation && conversation.messages.length > messageCount) {
      // Only auto-scroll if user is not manually scrolling
      if (!isUserScrolling) {
        scrollToBottom();
      }
      setMessageCount(conversation.messages.length);
    }
  }, [conversation?.messages, messageCount, isUserScrolling]);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message' && conversation) {
        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, data.message]
        } : null);
        
        if (!isOpen) {
          setHasNewMessage(true);
        }
      }
    };
    
    wsRef.current.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const startConversation = async (assistantType: 'ai_assistant' | 'human_support') => {
    try {
      const assistantNames = {
        ai_assistant: 'AI Assistant',
        human_support: 'Human Support'
      };
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: assistantNames[assistantType],
          message: `Hello, I need assistance from ${assistantNames[assistantType]}.`,
          guestName: 'Anonymous',
          conversationType: assistantType,
        }),
      });

      if (response.ok) {
        const conversationWithMessages = await response.json();
        setConversation(conversationWithMessages);
        setSelectedAssistantType(assistantType);
        setShowChoiceMenu(false);
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'join_conversation',
            conversationId: conversationWithMessages.id
          }));
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to start conversation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const refreshMessages = async () => {
    if (!conversation) return;

    try {
      const response = await fetch(`/api/conversations/${conversation.id}`);
      if (response.ok) {
        const updatedConversation = await response.json();
        setConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !conversation) return;

    try {
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);
        setMessage('');
        
        // Refresh messages after 1 second and again after 3 seconds to get AI response
        setTimeout(() => {
          refreshMessages();
        }, 1000);
        setTimeout(() => {
          refreshMessages();
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setHasNewMessage(false);
      if (!conversation) {
        setShowChoiceMenu(true);
      }
    }
  };

  // Auto-refresh messages when chat is open
  useEffect(() => {
    if (!isOpen || !conversation) return;

    const interval = setInterval(() => {
      refreshMessages();
    }, 5000); // Poll every 5 seconds (less intrusive)

    return () => clearInterval(interval);
  }, [isOpen, conversation?.id]);

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setConversation(null);
    setSelectedAssistantType(null);
    setShowChoiceMenu(true);
    setMessage('');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={handleToggle}
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {hasNewMessage && (
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </Button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 h-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Card className="h-full bg-black/95 backdrop-blur-xl border-purple-500/30 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  {!showChoiceMenu && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={resetChat}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <CardTitle className="text-sm font-semibold text-white">
                    {showChoiceMenu 
                      ? 'Support Chat' 
                      : selectedAssistantType === 'ai_assistant' 
                        ? 'AI Assistant' 
                        : 'Human Support'
                    }
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={handleMinimize}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0 relative">
                <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll} ref={scrollAreaRef}>
                  {showChoiceMenu ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-6">
                      <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                      <div>
                        <p className="text-lg font-semibold text-white mb-2">Welcome to ReArt Events</p>
                        <p className="text-sm">How would you like to get assistance?</p>
                      </div>
                      
                      <div className="space-y-3 w-full max-w-xs">
                        <Button
                          onClick={() => startConversation('ai_assistant')}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          AI Assistant
                        </Button>
                        
                        <Button
                          onClick={() => startConversation('human_support')}
                          variant="outline"
                          className="w-full bg-transparent border-purple-500/50 text-purple-300 hover:bg-purple-500/20 py-3"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Human Support
                        </Button>
                      </div>
                    </div>
                  ) : conversation?.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                      <MessageCircle className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">
                        {selectedAssistantType === 'ai_assistant' ? 'AI Assistant Ready' : 'Connecting to Human Support'}
                      </p>
                      <p className="text-xs mt-1">How can we help you today?</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversation?.messages.map((msg, index) => (
                        <div
                          key={`${msg.id}-${index}`}
                          className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              msg.senderType === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                                : 'bg-gray-800 text-gray-100 border border-gray-700'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Scroll to Bottom Button */}
                <AnimatePresence>
                  {isUserScrolling && !showChoiceMenu && (
                    <motion.div
                      className="absolute bottom-20 right-4 z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button
                        onClick={() => scrollToBottom(true)}
                        size="sm"
                        className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="p-4 border-t border-purple-500/20">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                      disabled={!conversation}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || !conversation}
                      className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Indicator */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              setIsMinimized(false);
              setIsOpen(true);
            }}
          >
            <Card className="bg-black/95 backdrop-blur-xl border-purple-500/30 shadow-lg cursor-pointer hover:border-purple-500/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-white">Support Chat</span>
                  {hasNewMessage && (
                    <div className="h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}