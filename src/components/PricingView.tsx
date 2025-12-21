import React from 'react';
import { Check, Sparkles, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PricingView: React.FC = () => {
  const freeTier = [
    'Daily check-ins (text)',
    'Basic journaling',
    'Text reflections',
    'Reset mode (text)',
  ];

  const plusTier = [
    'Everything in Free',
    'Unlimited journaling',
    'Thought Untangler',
    'Pattern insights',
    'Voice mode: talk + listen',
  ];

  return (
    <div className="min-h-screen px-6 pb-24 pt-12 animate-fade-in">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-heading font-semibold text-foreground mb-3">
            Simple, honest pricing
          </h1>
          <p className="text-muted-foreground">
            No hidden features. No mid-conversation paywalls.
          </p>
        </div>

        {/* Free tier */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Free</span>
              <span className="text-sm font-normal text-muted-foreground">Always</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {freeTier.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Plus tier */}
        <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>ClearMind Plus</span>
              </div>
            </CardTitle>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-semibold text-foreground">$12.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              or $119/year (save 24%)
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plusTier.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="flex items-center gap-2">
                    {feature}
                    {feature.includes('Voice') && (
                      <Mic className="w-4 h-4 text-accent" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
            
            <Button variant="glow" size="lg" className="w-full">
              Start free trial
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              7-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>

        {/* Trust message */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground/60">
            Your conversations are private and encrypted.
            <br />
            We never sell your data. Ever.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingView;
