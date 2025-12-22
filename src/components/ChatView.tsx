import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import ConversationSidebar from './ConversationSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatViewProps {
  mode: 'text' | 'voice';
  onBack: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatView: React.FC<ChatViewProps> = ({ mode, onBack }) => {
  const { user, signOut } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    createConversation,
    selectConversation,
    addMessage,
    updateLastMessage,
    finalizeAssistantMessage,
    deleteConversation,
  } = useConversations();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create initial conversation if none exists
  useEffect(() => {
    if (user && conversations.length === 0 && !currentConversation) {
      createConversation();
    }
  }, [user, conversations.length, currentConversation, createConversation]);

  const streamChat = async (
    chatMessages: { role: string; content: string }[],
    onDelta: (text: string) => void,
    onDone: () => void
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: chatMessages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        throw new Error(errorData.error || "Rate limit reached. Please wait a moment.");
      }
      if (resp.status === 402) {
        throw new Error(errorData.error || "Usage limit reached.");
      }
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let activeConversation = currentConversation;
    
    // Create conversation if none exists
    if (!activeConversation) {
      activeConversation = await createConversation();
      if (!activeConversation) return;
    }

    const userContent = input.trim();
    setInput('');
    setIsLoading(true);

    // Save user message to database
    await addMessage('user', userContent);

    let assistantContent = "";

    try {
      const chatHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userContent },
      ];

      await streamChat(
        chatHistory,
        (chunk) => {
          assistantContent += chunk;
          updateLastMessage(assistantContent);
        },
        async () => {
          // Save final assistant message to database
          await finalizeAssistantMessage(assistantContent);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleNewConversation = async () => {
    await createConversation();
    setSidebarOpen(false);
  };

  const handleSelectConversation = async (conv: typeof conversations[0]) => {
    await selectConversation(conv);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const sidebarContent = (
    <ConversationSidebar
      conversations={conversations}
      currentConversation={currentConversation}
      onSelect={handleSelectConversation}
      onNew={handleNewConversation}
      onDelete={deleteConversation}
    />
  );

  // Display messages with initial greeting if empty
  const displayMessages = messages.length === 0 
    ? [{ id: 'welcome', role: 'assistant' as const, content: "What's been weighing on you today?", created_at: new Date().toISOString() }]
    : messages;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="w-72 shrink-0">
          {sidebarContent}
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72">
                    {sidebarContent}
                  </SheetContent>
                </Sheet>
              )}
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                {mode === 'voice' ? 'Voice mode' : 'Text mode'}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
          <div className="max-w-2xl mx-auto space-y-6">
            {displayMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border/50 rounded-bl-md'
                  }`}
                >
                  <p className="text-body leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur-xl p-4">
          <div className="max-w-2xl mx-auto flex items-end gap-3" style={{ marginLeft: isMobile ? 'auto' : 'calc(50% + 144px - 336px)' }}>
            {mode === 'voice' && (
              <Button
                variant={isListening ? 'default' : 'soft'}
                size="icon"
                onClick={toggleListening}
                className={isListening ? 'glow-effect' : ''}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            )}
            
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind..."
                rows={1}
                disabled={isLoading}
                className="w-full resize-none rounded-xl border border-border/50 bg-card px-4 py-3 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <Button
              variant="default"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
