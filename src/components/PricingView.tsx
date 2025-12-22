import React from 'react';
import { Check, Sparkles, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  const comparisonFeatures = [
    { feature: 'Monthly Price', clearmind: '$12.99', calm: '$16.99', headspace: '$12.99', wysa: '$6.25' },
    { feature: 'Annual Price', clearmind: '$119/yr', calm: '$79.99/yr', headspace: '$69.99/yr', wysa: '$74.99/yr' },
    { feature: 'AI Companion', clearmind: true, calm: 'Limited', headspace: true, wysa: true },
    { feature: 'Voice Conversations', clearmind: true, calm: false, headspace: false, wysa: false },
    { feature: 'Thought Untangler', clearmind: true, calm: false, headspace: false, wysa: false },
    { feature: 'Pattern Insights', clearmind: true, calm: false, headspace: 'Basic', wysa: 'Limited' },
    { feature: 'Unlimited Journaling', clearmind: true, calm: false, headspace: 'Basic', wysa: 'Basic' },
    { feature: 'Mind Mapping', clearmind: true, calm: false, headspace: false, wysa: false },
  ];

  const renderCellValue = (value: boolean | string, isHighlighted: boolean = false) => {
    if (value === true) {
      return <Check className={`w-5 h-5 mx-auto ${isHighlighted ? 'text-primary' : 'text-green-500'}`} />;
    }
    if (value === false) {
      return <X className="w-5 h-5 mx-auto text-muted-foreground/40" />;
    }
    return <span className={isHighlighted ? 'font-medium text-foreground' : 'text-muted-foreground'}>{value}</span>;
  };

  return (
    <div className="min-h-screen px-6 pb-24 pt-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-heading font-semibold text-foreground mb-3">
            Simple, honest pricing
          </h1>
          <p className="text-muted-foreground">
            No hidden features. No mid-conversation paywalls.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
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
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              How we compare
            </h2>
            <p className="text-muted-foreground text-sm">
              More features than Calm. Same price as Headspace. Actually listens to you.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[180px]">Feature</TableHead>
                  <TableHead className="text-center bg-primary/10 border-x border-primary/20">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-primary font-medium">Best Value</span>
                      <span className="font-semibold text-foreground">ClearMind</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Calm</TableHead>
                  <TableHead className="text-center">Headspace</TableHead>
                  <TableHead className="text-center">Wysa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map((row, index) => (
                  <TableRow key={row.feature} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                    <TableCell className="font-medium text-foreground/80">{row.feature}</TableCell>
                    <TableCell className="text-center bg-primary/5 border-x border-primary/10">
                      {renderCellValue(row.clearmind, true)}
                    </TableCell>
                    <TableCell className="text-center">{renderCellValue(row.calm)}</TableCell>
                    <TableCell className="text-center">{renderCellValue(row.headspace)}</TableCell>
                    <TableCell className="text-center">{renderCellValue(row.wysa)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground/60 text-center mt-3">
            *Prices as of 2024. Wysa shows monthly equivalent of annual plan.
          </p>
        </div>

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
