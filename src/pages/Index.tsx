import React, { useState } from 'react';
import HomeView from '@/components/HomeView';
import ChatView from '@/components/ChatView';
import VoiceChatView from '@/components/VoiceChatView';
import JournalView from '@/components/JournalView';
import ResetView from '@/components/ResetView';
import PricingView from '@/components/PricingView';
import NavigationBar from '@/components/NavigationBar';

type View = 'home' | 'chat' | 'voiceChat' | 'journal' | 'reset' | 'pricing';
type ChatMode = 'text' | 'voice';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [chatMode, setChatMode] = useState<ChatMode>('text');

  const handleStartChat = (mode: ChatMode) => {
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

  // Chat view has its own navigation
  if (currentView === 'chat') {
    return <ChatView mode={chatMode} onBack={handleBackFromChat} />;
  }

  if (currentView === 'voiceChat') {
    return <VoiceChatView onBack={handleBackFromChat} />;
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
