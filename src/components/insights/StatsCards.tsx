import React from 'react';
import { MessageCircle, BookOpen, Brain, Flame, Calendar } from 'lucide-react';

interface StatsCardsProps {
  totalConversations: number;
  totalJournalEntries: number;
  totalUntangles: number;
  currentStreak: number;
  daysSinceJoined: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalConversations,
  totalJournalEntries,
  totalUntangles,
  currentStreak,
  daysSinceJoined
}) => {
  const stats = [
    { 
      label: 'Conversations', 
      value: totalConversations, 
      icon: MessageCircle,
      color: 'text-primary'
    },
    { 
      label: 'Journal Entries', 
      value: totalJournalEntries, 
      icon: BookOpen,
      color: 'text-accent'
    },
    { 
      label: 'Untangles', 
      value: totalUntangles, 
      icon: Brain,
      color: 'text-primary'
    },
    { 
      label: 'Day Streak', 
      value: currentStreak, 
      icon: Flame,
      color: 'text-destructive'
    },
    { 
      label: 'Days Active', 
      value: daysSinceJoined, 
      icon: Calendar,
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div 
          key={label}
          className="bg-secondary/50 rounded-xl p-4 flex flex-col items-center gap-2"
        >
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground text-center">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
