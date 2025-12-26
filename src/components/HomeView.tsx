import React from 'react';
import { MessageCircle, Mic, ArrowRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import BreathingOrb from './BreathingOrb';
import MoodCheckinCard from './MoodCheckinCard';
import StreakDisplay from './StreakDisplay';
import MilestoneCelebration from './MilestoneCelebration';
import ContextualSuggestions, { getTimeGreeting } from './ContextualSuggestions';
import { useAuth } from '@/hooks/useAuth';
import { useStreak } from '@/hooks/useStreak';
import { useProfile } from '@/hooks/useProfile';
import { usePremium } from '@/hooks/usePremium';

interface HomeViewProps {
  onStartChat: (mode: 'text' | 'voice') => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartChat }) => {
  const { user } = useAuth();
  const { streakCount, isNewMilestone, milestone, clearMilestone, loading: streakLoading } = useStreak();
  const { profile, loading: profileLoading } = useProfile();
  const { isPremium, checkLimit, getUsageDisplay } = usePremium();
  const navigate = useNavigate();

  const chatCheck = checkLimit('chat');

  return (
    <>
      {isNewMilestone && milestone && (
        <MilestoneCelebration milestone={milestone} onClose={clearMilestone} />
      )}
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 pt-12 animate-fade-in">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto w-full">
        {/* Breathing orb */}
        <div className="mb-8">
          <BreathingOrb size="lg" />
        </div>

        {/* Streak display */}
        {user && !streakLoading && (
          <div className="mb-4">
            <StreakDisplay streakCount={streakCount} size="lg" />
          </div>
        )}

        {/* Personalized greeting or Logo */}
        {user && profile?.displayName ? (
          <>
            <h1 className="text-display font-semibold text-foreground mb-2 tracking-tight">
              {getTimeGreeting()}, {profile.displayName}
            </h1>
            <p className="text-body-lg text-muted-foreground mb-6 text-balance">
              What's on your mind today?
            </p>
          </>
        ) : (
          <>
            <h1 className="text-display font-semibold text-foreground mb-4 tracking-tight">
              ClearMind
            </h1>
            <p className="text-body-lg text-muted-foreground mb-8 text-balance">
              A quiet space to untangle your thoughts and find clarity.
            </p>
          </>
        )}

        {/* Contextual suggestions based on goals */}
        {user && !profileLoading && profile?.goals && profile.goals.length > 0 && (
          <div className="w-full mb-6">
            <ContextualSuggestions goals={profile.goals} />
          </div>
        )}

        {/* Mood check-in for logged in users */}
        {user && (
          <div className="w-full mb-8">
            <MoodCheckinCard />
          </div>
        )}

        {/* Primary CTA */}
        <div className="relative w-full max-w-xs">
          <Button
            variant="glow"
            size="xl"
            onClick={() => onStartChat('text')}
            className="w-full mb-4"
          >
            <MessageCircle className="w-6 h-6" />
            Talk it out
          </Button>
          {user && !isPremium && (
            <span className="absolute -top-2 -right-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {chatCheck.remaining}/{chatCheck.limit} today
            </span>
          )}
        </div>

        {/* Voice option */}
        <Button
          variant="calm"
          size="lg"
          onClick={() => onStartChat('voice')}
          className="w-full max-w-xs"
        >
          <Mic className="w-5 h-5" />
          Voice mode
          {!isPremium && (
            <span className="ml-2 text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              30s preview
            </span>
          )}
        </Button>

        {/* Upgrade prompt for free users */}
        {user && !isPremium && (
          <button
            onClick={() => navigate('/pricing')}
            className="mt-4 flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade for unlimited access</span>
          </button>
        )}

        {/* Subtle tagline */}
        <p className="mt-8 text-sm text-muted-foreground/60">
          Not therapy. Just clarity.
        </p>

        {/* Compare link */}
        <Link 
          to="/compare" 
          className="mt-4 text-sm text-primary/80 hover:text-primary transition-colors flex items-center gap-1 group"
        >
          See how we compare to other apps
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
    </>
  );
};

export default HomeView;
