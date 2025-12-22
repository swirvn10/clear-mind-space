import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeView from '@/components/HomeView';
import ChatView from '@/components/ChatView';
import VoiceChatView from '@/components/VoiceChatView';
import JournalView from '@/components/JournalView';
import ResetView from '@/components/ResetView';
import PricingView from '@/components/PricingView';
import ThoughtUntanglerView from '@/components/ThoughtUntanglerView';
import NavigationBar from '@/components/NavigationBar';
import { useAuth } from '@/hooks/useAuth';

type View = 'home' | 'chat' | 'voiceChat' | 'journal' | 'reset' | 'pricing' | 'untangle';
type ChatMode = 'text' | 'voice';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [chatMode, setChatMode] = useState<ChatMode>('text');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStartChat = (mode: ChatMode) => {
    // Require auth for chat
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setChatMode(mode);
    if (mode === 'voice') {
      setCurrentView('voiceChat');
    } else {
      setCurrentView('chat');
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  const handleBackFromChat = () => {
    setCurrentView('home');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Chat view has its own navigation
  if (currentView === 'chat') {
    if (!user) {
      navigate('/auth');
      return null;
    }
    return <ChatView mode={chatMode} onBack={handleBackFromChat} />;
  }

  if (currentView === 'voiceChat') {
    if (!user) {
      navigate('/auth');
      return null;
    }
    return <VoiceChatView onBack={handleBackFromChat} />;
  }

  if (currentView === 'untangle') {
    if (!user) {
      navigate('/auth');
      return null;
    }
    return (
      <div className="min-h-screen bg-background">
        <ThoughtUntanglerView />
        <NavigationBar activeView={currentView} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'home' && <HomeView onStartChat={handleStartChat} />}
      {currentView === 'journal' && <JournalView />}
      {currentView === 'reset' && <ResetView />}
      {currentView === 'pricing' && <PricingView />}
      
      <NavigationBar activeView={currentView} onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
