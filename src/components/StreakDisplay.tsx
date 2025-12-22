import React from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakDisplayProps {
  streakCount: number;
  size?: 'sm' | 'md' | 'lg';
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ streakCount, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-lg gap-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (streakCount === 0) {
    return (
      <div className={`flex items-center ${sizeClasses[size]} text-muted-foreground`}>
        <Flame className={iconSizes[size]} />
        <span>Start your streak!</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center ${sizeClasses[size]}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flame className={`${iconSizes[size]} text-orange-500`} />
      </motion.div>
      <span className="font-semibold text-foreground">
        {streakCount} day{streakCount !== 1 ? 's' : ''}
      </span>
    </motion.div>
  );
};

export default StreakDisplay;
