import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BreathingOrb from './BreathingOrb';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const ResetView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);

  const phaseConfig = {
    inhale: { duration: 4, next: 'hold' as Phase, instruction: 'Breathe in' },
    hold: { duration: 4, next: 'exhale' as Phase, instruction: 'Hold' },
    exhale: { duration: 6, next: 'rest' as Phase, instruction: 'Breathe out' },
    rest: { duration: 2, next: 'inhale' as Phase, instruction: 'Rest' },
  };

  const resetExercise = useCallback(() => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const currentPhase = phaseConfig[phase];
          const nextPhase = currentPhase.next;
          
          if (phase === 'rest') {
            setCycles((c) => c + 1);
          }
          
          setPhase(nextPhase);
          return phaseConfig[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleActive = () => {
    if (!isActive) {
      setPhase('inhale');
      setCountdown(phaseConfig.inhale.duration);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 pt-12 animate-fade-in">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-heading font-semibold text-foreground mb-2">Reset</h1>
        <p className="text-muted-foreground mb-12">
          A 2-minute grounding exercise to find your center.
        </p>

        {/* Breathing visualization */}
        <div className="relative mb-12">
          <BreathingOrb size="lg" className={isActive ? 'animate-breathe' : ''} />
          
          {/* Instruction overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isActive && (
              <>
                <span className="text-2xl font-semibold text-primary mb-2 animate-fade-in">
                  {phaseConfig[phase].instruction}
                </span>
                <span className="text-5xl font-light text-foreground animate-fade-in">
                  {countdown}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={isActive ? 'soft' : 'glow'}
            size="xl"
            onClick={toggleActive}
            className="min-w-[160px]"
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                Begin
              </>
            )}
          </Button>
          
          {(isActive || cycles > 0) && (
            <Button variant="ghost" size="icon" onClick={resetExercise}>
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Cycle counter */}
        {cycles > 0 && (
          <p className="text-sm text-muted-foreground animate-fade-in">
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
          </p>
        )}

        {/* Info text */}
        {!isActive && cycles === 0 && (
          <div className="mt-8 p-6 rounded-2xl bg-card/50 border border-border/50 text-left animate-fade-in">
            <h3 className="font-medium text-foreground mb-2">How it works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This exercise uses box breathing to activate your body's natural calm response.
              Each cycle takes about 16 seconds. Three to four cycles is usually enough to feel
              a shift.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetView;
