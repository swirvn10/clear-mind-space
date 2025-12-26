import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, X, Zap, Heart, Brain, Mic } from 'lucide-react';
import { usePremium, FeatureType, FREE_LIMITS } from '@/hooks/usePremium';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  feature: FeatureType;
  children: ReactNode;
  showUsageCounter?: boolean;
}

const featureConfig = {
  chat: {
    icon: Heart,
    title: 'Unlimited Conversations',
    description: 'Free users get 5 AI chats per day. Upgrade to have unlimited heart-to-heart conversations whenever you need support.',
    benefits: [
      'Unlimited daily conversations',
      'Priority response times',
      'Extended conversation memory',
    ],
  },
  journal: {
    icon: Brain,
    title: 'Unlimited Journal Entries',
    description: 'Free users get 10 journal entries per month. Upgrade to capture every thought and insight without limits.',
    benefits: [
      'Unlimited monthly entries',
      'Advanced mood analytics',
      'Export your journal history',
    ],
  },
  untangle: {
    icon: Sparkles,
    title: 'Thought Untangler',
    description: 'This powerful AI tool helps organize scattered thoughts into clear insights. Free users get 1 session per day.',
    benefits: [
      'Unlimited daily sessions',
      'Save and revisit past analyses',
      'Advanced pattern recognition',
    ],
  },
  voice: {
    icon: Mic,
    title: 'Voice Conversations',
    description: 'Have natural spoken conversations with your AI companion. Free users get a 30-second preview.',
    benefits: [
      'Unlimited voice time',
      'Multiple voice options',
      'Real-time emotional support',
    ],
  },
};

export function PremiumGate({ feature, children, showUsageCounter = true }: PremiumGateProps) {
  const { isPremium, checkLimit, getUsageDisplay, loading } = usePremium();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <>{children}</>;
  }

  const check = checkLimit(feature);
  const config = featureConfig[feature];

  // Premium users always have access
  if (isPremium) {
    return <>{children}</>;
  }

  // Free users within limits
  if (check.allowed) {
    return (
      <div className="relative">
        {showUsageCounter && (
          <UsageCounter feature={feature} remaining={check.remaining} limit={check.limit} />
        )}
        {children}
      </div>
    );
  }

  // Free users at limit - show upgrade modal
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Crown className="w-10 h-10 text-amber-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            You've reached your daily limit
          </h3>
          <p className="text-muted-foreground max-w-md">
            {config.description}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Limits reset at midnight • Cancel anytime
        </p>
      </motion.div>

      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
        feature={feature}
        onUpgrade={() => navigate('/pricing')}
      />
    </>
  );
}

function UsageCounter({ feature, remaining, limit }: { feature: FeatureType; remaining: number; limit: number }) {
  const percentage = (remaining / limit) * 100;
  const isLow = percentage <= 40;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-2 right-2 z-10"
    >
      <div className={`
        px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2
        ${isLow 
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
          : 'bg-muted text-muted-foreground'
        }
      `}>
        {feature === 'voice' ? (
          <span>{remaining}s left</span>
        ) : (
          <span>{remaining}/{limit} left</span>
        )}
        {isLow && <Sparkles className="w-3 h-3" />}
      </div>
    </motion.div>
  );
}

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: FeatureType;
  onUpgrade: () => void;
}

function UpgradeModal({ open, onOpenChange, feature, onUpgrade }: UpgradeModalProps) {
  const config = featureConfig[feature];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-left">{config.title}</DialogTitle>
              <DialogDescription className="text-left">
                Unlock the full experience
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>

          <div className="space-y-2">
            {config.benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-green-500" />
                </div>
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => {
                onOpenChange(false);
                onUpgrade();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              View Premium Plans
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full text-muted-foreground"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Soft nudge component for subtle upgrade prompts
export function UpgradeNudge({ className = '' }: { className?: string }) {
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  if (isPremium) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/pricing')}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        bg-gradient-to-r from-amber-500/10 to-orange-500/10
        hover:from-amber-500/20 hover:to-orange-500/20
        text-amber-600 dark:text-amber-400
        transition-all duration-200
        ${className}
      `}
    >
      <Crown className="w-3.5 h-3.5" />
      <span>Upgrade</span>
    </motion.button>
  );
}

// Premium badge for feature labels
export function PremiumBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
      bg-gradient-to-r from-amber-500/20 to-orange-500/20
      text-amber-600 dark:text-amber-400
      ${className}
    `}>
      <Crown className="w-3 h-3" />
      Premium
    </span>
  );
}
