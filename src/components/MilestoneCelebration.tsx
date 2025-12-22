import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MilestoneCelebrationProps {
  milestone: number;
  onClose: () => void;
}

const getMilestoneMessage = (days: number): { title: string; message: string; icon: React.ReactNode } => {
  if (days >= 365) {
    return {
      title: "Legendary!",
      message: "A full year of mindfulness. You're truly inspiring.",
      icon: <Trophy className="w-12 h-12 text-yellow-400" />,
    };
  }
  if (days >= 90) {
    return {
      title: "Incredible!",
      message: "90 days of clarity. You've built a life-changing habit.",
      icon: <Trophy className="w-12 h-12 text-amber-400" />,
    };
  }
  if (days >= 30) {
    return {
      title: "Amazing!",
      message: "30 days strong. This is becoming part of who you are.",
      icon: <Star className="w-12 h-12 text-purple-400" />,
    };
  }
  if (days >= 14) {
    return {
      title: "Two Weeks!",
      message: "You're building real momentum. Keep going!",
      icon: <Sparkles className="w-12 h-12 text-blue-400" />,
    };
  }
  if (days >= 7) {
    return {
      title: "One Week!",
      message: "A full week of showing up for yourself.",
      icon: <Flame className="w-12 h-12 text-orange-400" />,
    };
  }
  return {
    title: "Nice Start!",
    message: "You're on your way to building a great habit.",
    icon: <Flame className="w-12 h-12 text-orange-400" />,
  };
};

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ milestone, onClose }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const { title, message, icon } = getMilestoneMessage(milestone);

  useEffect(() => {
    // Generate celebration particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Celebration particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              y: '100vh', 
              x: `${particle.x}vw`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{ 
              y: '-10vh',
              opacity: [1, 1, 0],
            }}
            transition={{ 
              duration: 2,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            className="fixed pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
        ))}

        {/* Main celebration card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative bg-card border border-border rounded-2xl p-8 max-w-sm mx-4 text-center shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, damping: 10 }}
            className="flex justify-center mb-4"
          >
            {icon}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-3xl font-bold text-primary">{milestone}</span>
              <span className="text-lg text-muted-foreground">day streak!</span>
            </div>
            <p className="text-muted-foreground mb-6">{message}</p>
          </motion.div>

          <Button variant="glow" onClick={onClose} className="w-full">
            Keep Going!
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MilestoneCelebration;
