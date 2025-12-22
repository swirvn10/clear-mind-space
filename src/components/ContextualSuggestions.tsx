import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Wind, PenLine, Brain, Heart, Moon, Sun, Coffee } from 'lucide-react';

interface Suggestion {
  icon: React.ReactNode;
  text: string;
  priority: number;
}

interface ContextualSuggestionsProps {
  goals: string[] | null;
}

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getTimeGreeting = (): string => {
  const time = getTimeOfDay();
  switch (time) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Good night';
  }
};

const getTimeSuggestion = (): Suggestion => {
  const time = getTimeOfDay();
  switch (time) {
    case 'morning':
      return {
        icon: <Coffee className="w-4 h-4" />,
        text: "Start your day with a moment of clarity",
        priority: 1,
      };
    case 'afternoon':
      return {
        icon: <Sun className="w-4 h-4" />,
        text: "Take a mindful break to reset",
        priority: 1,
      };
    case 'evening':
      return {
        icon: <Heart className="w-4 h-4" />,
        text: "Reflect on your day's moments",
        priority: 1,
      };
    case 'night':
      return {
        icon: <Moon className="w-4 h-4" />,
        text: "Unwind and release today's thoughts",
        priority: 1,
      };
  }
};

const getGoalSuggestions = (goals: string[]): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  goals.forEach((goal) => {
    switch (goal) {
      case 'reduce-stress':
        suggestions.push({
          icon: <Wind className="w-4 h-4" />,
          text: "Try a breathing exercise to calm your mind",
          priority: 2,
        });
        break;
      case 'manage-anxiety':
        suggestions.push({
          icon: <Brain className="w-4 h-4" />,
          text: "Use the Thought Untangler to break down worries",
          priority: 2,
        });
        break;
      case 'find-clarity':
        suggestions.push({
          icon: <Lightbulb className="w-4 h-4" />,
          text: "Talk through what's on your mind",
          priority: 2,
        });
        break;
      case 'build-habits':
        suggestions.push({
          icon: <PenLine className="w-4 h-4" />,
          text: "Add a journal entry to track your progress",
          priority: 2,
        });
        break;
      case 'improve-sleep':
        suggestions.push({
          icon: <Moon className="w-4 h-4" />,
          text: "Wind down with a calming conversation",
          priority: 2,
        });
        break;
      case 'self-reflection':
        suggestions.push({
          icon: <Heart className="w-4 h-4" />,
          text: "Journal your thoughts and feelings",
          priority: 2,
        });
        break;
    }
  });

  return suggestions;
};

const ContextualSuggestions: React.FC<ContextualSuggestionsProps> = ({ goals }) => {
  const timeSuggestion = getTimeSuggestion();
  const goalSuggestions = goals ? getGoalSuggestions(goals) : [];
  
  // Combine and limit suggestions
  const allSuggestions = [timeSuggestion, ...goalSuggestions].slice(0, 2);

  if (allSuggestions.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      {allSuggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50"
        >
          <div className="text-primary">{suggestion.icon}</div>
          <span className="text-sm text-muted-foreground">{suggestion.text}</span>
        </motion.div>
      ))}
    </div>
  );
};

export { getTimeGreeting };
export default ContextualSuggestions;
