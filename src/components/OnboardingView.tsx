import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, MessageCircle, Mic, PenLine, Wind, Sparkles, Check } from 'lucide-react';
import MoodSelector from './MoodSelector';
import { useMoodCheckins } from '@/hooks/useMoodCheckins';
import { toast } from 'sonner';

interface OnboardingViewProps {
  onComplete: (goals: string[]) => void;
}

const GOALS = [
  { id: 'stress', label: 'Manage stress', icon: '😮‍💨' },
  { id: 'anxiety', label: 'Reduce anxiety', icon: '😰' },
  { id: 'clarity', label: 'Gain mental clarity', icon: '🧠' },
  { id: 'sleep', label: 'Improve sleep', icon: '😴' },
  { id: 'emotions', label: 'Understand emotions', icon: '💭' },
  { id: 'habits', label: 'Build healthy habits', icon: '🌱' },
];

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'AI Companion',
    description: 'Chat with ClearMind anytime for support and guidance',
  },
  {
    icon: Mic,
    title: 'Voice Mode',
    description: 'Have natural voice conversations when typing feels like too much',
  },
  {
    icon: Brain,
    title: 'Thought Untangler',
    description: 'Visualize and organize your thoughts into clarity',
  },
  {
    icon: PenLine,
    title: 'Journal',
    description: 'Record your thoughts and track patterns over time',
  },
  {
    icon: Wind,
    title: 'Breathing Exercises',
    description: 'Calm your mind with guided breathing techniques',
  },
];

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { createCheckin } = useMoodCheckins();

  const totalSteps = 4;

  const handleMoodSelect = async (mood: number) => {
    setSelectedMood(mood);
    try {
      await createCheckin(mood);
    } catch (error) {
      // Silent fail - mood will still be shown
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    if (selectedGoals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }
    onComplete(selectedGoals);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Progress dots */}
      <div className="absolute top-8 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? 'w-8 bg-primary'
                : i < step
                ? 'w-2 bg-primary/50'
                : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="welcome"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-semibold text-foreground">
                  Welcome to ClearMind
                </h1>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                  Your personal AI companion for mental clarity and emotional wellness
                </p>
              </div>

              <Button onClick={handleNext} size="lg" className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 1: How are you feeling */}
          {step === 1 && (
            <motion.div
              key="mood"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center space-y-8"
            >
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  How are you feeling right now?
                </h1>
                <p className="text-muted-foreground">
                  Let's start by checking in with yourself
                </p>
              </div>

              <MoodSelector
                selectedMood={selectedMood}
                onSelect={handleMoodSelect}
                size="lg"
              />

              <Button
                onClick={handleNext}
                size="lg"
                className="gap-2"
                disabled={selectedMood === null}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <motion.div
              key="goals"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  What brings you here?
                </h1>
                <p className="text-muted-foreground">
                  Select all that apply
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      selectedGoals.includes(goal.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 bg-card hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {goal.label}
                    </span>
                    {selectedGoals.includes(goal.id) && (
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                size="lg"
                className="gap-2"
                disabled={selectedGoals.length === 0}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Features overview */}
          {step === 3 && (
            <motion.div
              key="features"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  You're all set!
                </h1>
                <p className="text-muted-foreground">
                  Here's what you can do with ClearMind
                </p>
              </div>

              <div className="space-y-3">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onClick={handleComplete} size="lg" className="gap-2">
                Start Your Journey
                <Sparkles className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
