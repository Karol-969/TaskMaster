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
  const [isSending, setIsSending] = useState(false);
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
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      
      if (data.type === 'ai' && conversation) {
        const newMessage = {
          id: Date.now(),
          message: data.content,
          senderType: 'admin' as const,
          createdAt: data.timestamp || new Date().toISOString()
        };
        
        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);
        
        if (!isOpen) {
          setHasNewMessage(true);
        }
      } else if (data.type === 'system') {
        console.log('System message:', data.content);
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
      
      console.log('Starting conversation with:', assistantType);
      
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify({
          subject: assistantNames[assistantType],
          message: `Hello, I need assistance from ${assistantNames[assistantType]}.`,
          guestName: 'Anonymous',
          conversationType: assistantType,
        }),
      });

      if (response.ok) {
        let conversationWithMessages = await response.json();
        // Map backend message fields to frontend expected fields
        if (conversationWithMessages.messages) {
          conversationWithMessages.messages = conversationWithMessages.messages.map((msg: any) => ({
            id: msg.id,
            message: msg.content ?? msg.message,
            senderType: (msg.sender === 'guest' || (msg.sender && msg.sender.startsWith('user'))) ? 'user' : 'admin',
            createdAt: msg.createdAt
          }));
        }
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
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to create conversation:', response.status, errorData);
        toast({
          title: "Error",
          description: errorData.message || "Failed to start conversation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Network error creating conversation:', error);
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
      const response = await fetch(`/api/conversations/${conversation.id}`, {
        credentials: 'include' // Include session cookies
      });
      if (response.ok) {
        let updatedConversation = await response.json();
        // Map backend message fields to frontend expected fields
        if (updatedConversation.messages) {
          updatedConversation.messages = updatedConversation.messages.map((msg: any) => ({
            id: msg.id,
            message: msg.content ?? msg.message,
            senderType: (msg.sender === 'guest' || (msg.sender && msg.sender.startsWith('user'))) ? 'user' : 'admin',
            createdAt: msg.createdAt
          }));
        }
        setConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !conversation || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      if (response.ok) {
        let newMessage = await response.json();
        // Map backend message fields to frontend expected fields
        newMessage = {
          id: newMessage.id,
          message: newMessage.content ?? newMessage.message,
          senderType: (newMessage.sender === 'guest' || (newMessage.sender && newMessage.sender.startsWith('user'))) ? 'user' : 'admin',
          createdAt: newMessage.createdAt
        };
        setConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);
        setMessage('');
        
        // Refresh messages immediately to get AI response
        setTimeout(() => {
          refreshMessages();
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to send message:', response.status, errorData);
        toast({
          title: "Error",
          description: errorData.message || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Network error. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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
    }, 10000); // Poll every 10 seconds for better performance

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
            <Card className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  {!showChoiceMenu && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={resetChat}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      {selectedAssistantType === 'ai_assistant' ? 
                        <Bot className="h-4 w-4 text-white" /> : 
                        <User className="h-4 w-4 text-white" />
                      }
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                        {showChoiceMenu 
                          ? 'ReArt Events Support' 
                          : selectedAssistantType === 'ai_assistant' 
                            ? 'AI Assistant' 
                            : 'Human Support'
                        }
                      </CardTitle>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedAssistantType === 'ai_assistant' ? 'Powered by AI' : 'Live Support'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {isConnected ? 'Online' : 'Connecting...'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    onClick={handleMinimize}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0 relative">
                <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll} ref={scrollAreaRef}>
                  {showChoiceMenu ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-slate-400 space-y-6 p-6">
                      <div className="relative">
                        <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">?</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Welcome to ReArt Events</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred support option</p>
                      </div>
                      
                      <div className="space-y-3 w-full">
                        <Button
                          onClick={() => startConversation('ai_assistant')}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Bot className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">AI Assistant</div>
                            <div className="text-xs opacity-90">Instant responses, 24/7</div>
                          </div>
                        </Button>
                        
                        <Button
                          onClick={() => startConversation('human_support')}
                          variant="outline"
                          className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <User className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Human Support</div>
                            <div className="text-xs opacity-70">Connect with our team</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  ) : conversation?.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-slate-400 p-8">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
                        selectedAssistantType === 'ai_assistant' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}>
                        {selectedAssistantType === 'ai_assistant' ? 
                          <Bot className="h-6 w-6 text-white" /> : 
                          <User className="h-6 w-6 text-white" />
                        }
                      </div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {selectedAssistantType === 'ai_assistant' ? 'AI Assistant Ready' : 'Human Support Connected'}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {selectedAssistantType === 'ai_assistant' 
                          ? 'Ask me anything about our event services, artist bookings, or venue rentals.' 
                          : 'You\'re connected with our support team. How can we assist you today?'}
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-xs text-slate-500 dark:text-slate-400">
                        💡 Try asking: "What services do you offer?" or "How can I book an artist?"
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversation?.messages.map((msg, index) => (
                        <div
                          key={`${msg.id}-${index}`}
                          className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                              msg.senderType === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-bl-md'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.message}</p>
                            <p className={`text-xs mt-2 ${
                              msg.senderType === 'user' 
                                ? 'text-white/70' 
                                : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
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
                
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={!conversation ? "Start a conversation first..." : "Type your message..."}
                        className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 rounded-full px-4 py-3 pr-12"
                        disabled={!conversation}
                      />
                      {message.trim() && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                          {message.length}/500
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || !conversation || isSending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="icon"
                    >
                      {isSending ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Press Enter to send • Shift+Enter for new line
                    </span>
                    {selectedAssistantType === 'ai_assistant' && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        AI • Instant replies
                      </span>
                    )}
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
            <Card className="bg-white dark:bg-black/95 backdrop-blur-xl border-purple-500/30 shadow-lg cursor-pointer hover:border-purple-500/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-900 dark:text-white">Support Chat</span>
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