import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGES = 2;

const suggestedPrompts = [
  "I'm feeling overwhelmed today",
  "I can't stop overthinking",
  "Help me process a tough decision"
];

export const PublicAIDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const hasReachedLimit = messageCount >= MAX_MESSAGES;

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || hasReachedLimit) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          isDemo: true
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data?.response || "I'm here to listen. Tell me more about what's on your mind."
      };

      setMessages(prev => [...prev, assistantMessage]);
      setMessageCount(prev => prev + 1);
    } catch (error) {
      console.error('Demo chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm here to help you process your thoughts. What's weighing on your mind today?"
        }
      ]);
      setMessageCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <section className="py-20 px-6 bg-card/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Try ClearMind's AI</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Ask ClearMind Anything
          </h2>
          <p className="text-muted-foreground">
            Experience the ClearMind tone with a quick demo. {MAX_MESSAGES - messageCount} messages remaining.
          </p>
        </div>

        <div className="rounded-2xl bg-background border border-border overflow-hidden">
          {/* Chat Area */}
          <div className="h-80 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-6">
                  Start a conversation or try one of these:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt)}
                      disabled={hasReachedLimit}
                      className="px-4 py-2 rounded-full bg-card border border-border text-sm text-foreground hover:border-primary/30 transition-colors disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="px-4 py-3 rounded-2xl bg-card border border-border">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Input Area or CTA */}
          {hasReachedLimit ? (
            <div className="p-6 border-t border-border bg-card/50 text-center">
              <p className="text-muted-foreground mb-4">
                Want to continue this conversation?
              </p>
              <Link to="/auth">
                <Button className="gap-2">
                  Continue in ClearMind
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  className="h-12 w-12 rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          This is a limited demo. Full ClearMind includes memory, voice mode, and more.
        </p>
      </div>
    </section>
  );
};

export default PublicAIDemo;
