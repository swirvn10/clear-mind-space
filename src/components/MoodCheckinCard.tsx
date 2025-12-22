import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import MoodSelector from './MoodSelector';
import { useMoodCheckins } from '@/hooks/useMoodCheckins';

const moodEmojis = ['', '😢', '😕', '😐', '🙂', '😊'];

const MoodCheckinCard: React.FC = () => {
  const { todayCheckin, createCheckin, loading } = useMoodCheckins();

  const handleMoodSelect = async (mood: number, note?: string) => {
    await createCheckin(mood, note);
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="h-20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todayCheckin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
          <CardContent className="p-5 text-center">
            <span className="text-4xl">{moodEmojis[todayCheckin.mood]}</span>
            <p className="text-sm text-muted-foreground mt-2">
              You checked in today
            </p>
            {todayCheckin.note && (
              <p className="text-sm text-foreground/80 mt-1 italic">
                "{todayCheckin.note}"
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium text-foreground mb-4 text-center">
            How are you feeling today?
          </h3>
          <MoodSelector onSelect={handleMoodSelect} showNote />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodCheckinCard;
