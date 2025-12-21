import React from 'react';

interface BreathingOrbProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const BreathingOrb: React.FC<BreathingOrbProps> = ({ size = 'md', className = '', intensity = 'medium' }) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const intensityClasses = {
    low: 'opacity-60',
    medium: 'opacity-80',
    high: 'opacity-100',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${intensityClasses[intensity]} ${className}`}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-breathe" />
      
      {/* Middle ring */}
      <div className="absolute inset-4 rounded-full bg-primary/10 blur-xl animate-breathe" style={{ animationDelay: '0.5s' }} />
      
      {/* Inner orb */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 backdrop-blur-sm animate-breathe border border-primary/30" style={{ animationDelay: '1s' }} />
      
      {/* Core */}
      <div className="absolute inset-16 rounded-full bg-primary/60 blur-sm animate-pulse-soft" />
    </div>
  );
};

export default BreathingOrb;
