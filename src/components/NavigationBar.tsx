import React from 'react';
import { Home, BookOpen, Brain, TrendingUp, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePremium } from '@/hooks/usePremium';
import { useNavigate } from 'react-router-dom';

interface NavigationBarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeView, onNavigate }) => {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'insights', icon: TrendingUp, label: 'Insights' },
    { id: 'untangle', icon: Brain, label: 'Untangle' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-around px-4 py-3 max-w-lg mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
              activeView === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
        {!isPremium && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pricing')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
          >
            <Crown className="w-5 h-5" />
            <span className="text-xs font-medium">Upgrade</span>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
