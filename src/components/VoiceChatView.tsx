import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import BreathingOrb from '@/components/BreathingOrb';
import VoiceSelector from '@/components/VoiceSelector';
import { useProfile } from '@/hooks/useProfile';
import { AIVoice } from '@/constants/voices';

interface VoiceChatViewProps {
  onBack: () => void;
}

interface Transcript {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const VoiceChatView: React.FC<VoiceChatViewProps> = ({ onBack }) => {
  const { profile, updateVoicePreference } = useProfile();
  const [selectedVoice, setSelectedVoice] = useState<AIVoice>('sage');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const chatRef = useRef<RealtimeChat | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement>(null);

  // Update selected voice when profile loads
  useEffect(() => {
    if (profile?.preferredVoice) {
      setSelectedVoice(profile.preferredVoice);
    }
  }, [profile?.preferredVoice]);

  const scrollToBottom = () => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcripts]);

  const handleMessage = useCallback((event: any) => {
    console.log('Voice event:', event.type);
  }, []);

  const handleConnectionChange = useCallback((status: 'connecting' | 'connected' | 'disconnected') => {
    setConnectionStatus(status);
    if (status === 'connected') {
      toast.success("Ready to listen", { description: "Take your time. Speak when you're ready." });
    } else if (status === 'disconnected' && chatRef.current) {
      toast.info("Conversation ended", { description: "Take care of yourself." });
    }
  }, []);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  const handleTranscript = useCallback((text: string, role: 'user' | 'assistant') => {
    setTranscripts(prev => [...prev, {
      id: Date.now().toString(),
      role,
      text
    }]);
  }, []);

  const handleVoiceChange = (voice: AIVoice) => {
    setSelectedVoice(voice);
    // Save preference in background
    updateVoicePreference(voice).catch(err => {
      console.error('Failed to save voice preference:', err);
    });
  };

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeChat(
        selectedVoice,
        handleMessage,
        handleConnectionChange,
        handleSpeakingChange,
        handleTranscript
      );
      await chatRef.current.init();
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start voice session');
      setConnectionStatus('disconnected');
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-4 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-amber-500 animate-pulse' :
              'bg-muted-foreground/50'
            }`} />
            <span className="text-sm text-muted-foreground">
              {connectionStatus === 'connected' ? 'Voice active' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Voice mode'}
            </span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 pb-32">
        {connectionStatus === 'disconnected' ? (
          <div className="text-center space-y-8">
            <BreathingOrb size="lg" />
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground">
                Voice Conversation
              </h2>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Share what's on your mind. ClearMind will listen with care and help you find clarity through gentle, grounded conversation.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Calm & patient</span>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">No judgment</span>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Your pace</span>
              </div>
            </div>
            
            {/* Voice Selector */}
            <div className="flex justify-center">
              <VoiceSelector
                value={selectedVoice}
                onChange={handleVoiceChange}
              />
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={startConversation}
              className="gap-2"
            >
              <Phone className="w-5 h-5" />
              Begin Conversation
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            {/* Visual indicator */}
            <div className="flex flex-col items-center py-8">
              <div className={`relative ${isSpeaking ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                <BreathingOrb size="lg" intensity={isSpeaking ? 'high' : 'low'} />
                {isSpeaking && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="w-1 h-6 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {isSpeaking ? 'ClearMind is here with you...' : 'I\'m listening...'}
              </p>
            </div>

            {/* Transcripts */}
            {transcripts.length > 0 && (
              <div className="space-y-4 max-h-64 overflow-y-auto px-4">
                {transcripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className={`flex ${transcript.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        transcript.role === 'user'
                          ? 'bg-primary/20 text-foreground rounded-br-md'
                          : 'bg-card border border-border/50 rounded-bl-md'
                      }`}
                    >
                      <p className="leading-relaxed">{transcript.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={transcriptsEndRef} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {connectionStatus !== 'disconnected' && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur-xl p-6">
          <div className="max-w-2xl mx-auto flex justify-center">
            <Button
              variant="destructive"
              size="lg"
              onClick={endConversation}
              className="gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              End Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChatView;
