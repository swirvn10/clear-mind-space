import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeView from '@/components/HomeView';
import ChatView from '@/components/ChatView';
import VoiceChatView from '@/components/VoiceChatView';
import JournalView from '@/components/JournalView';
import ResetView from '@/components/ResetView';
import InsightsView from '@/components/InsightsView';
import SettingsView from '@/components/SettingsView';
import ThoughtUntanglerView from '@/components/ThoughtUntanglerView';
import OnboardingView from '@/components/OnboardingView';
import NavigationBar from '@/components/NavigationBar';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useReminders } from '@/hooks/useReminders';
import { toast } from 'sonner';

type View = 'home' | 'chat' | 'voiceChat' | 'journal' | 'reset' | 'insights' | 'untangle' | 'settings';
type ChatMode = 'text' | 'voice';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [chatMode, setChatMode] = useState<ChatMode>('text');
  const { user, loading: authLoading } = useAuth();
  const { isOnboardingComplete, loading: onboardingLoading, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();
  
  // Initialize reminders (will show toast if reminder is due)
  useReminders();

  const handleStartChat = (mode: ChatMode) => {
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

  const handleOnboardingComplete = async (goals: string[]) => {
    try {
      await completeOnboarding(goals);
      toast.success('Welcome to ClearMind!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Show loading state
  if (authLoading || (user && onboardingLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show onboarding for new users
  if (user && isOnboardingComplete === false) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
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

  if (currentView === 'settings') {
    return <SettingsView onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'home' && <HomeView onStartChat={handleStartChat} />}
      {currentView === 'journal' && <JournalView />}
      {currentView === 'reset' && <ResetView />}
      {currentView === 'insights' && <InsightsView />}
      
      <NavigationBar activeView={currentView} onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
