import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Check, 
  X, 
  Sparkles, 
  Mic, 
  Brain, 
  Shield, 
  Zap, 
  Heart,
  ArrowRight,
  Star,
  Clock,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Compare: React.FC = () => {
  const navigate = useNavigate();

  const uniqueFeatures = [
    {
      icon: Mic,
      title: 'Real Voice Conversations',
      description: 'Talk naturally with our AI companion. No typing needed—just speak and be heard.',
      competitors: 'Others offer only text-based chat or pre-recorded content.',
    },
    {
      icon: Brain,
      title: 'Thought Untangler',
      description: 'Dump your messy thoughts and watch them transform into clear, actionable insights.',
      competitors: 'Unique to ClearMind. No competitor offers this.',
    },
    {
      icon: TrendingUp,
      title: 'Pattern Insights',
      description: 'AI-powered analysis reveals emotional patterns and triggers over time.',
      competitors: 'Basic mood tracking vs. our deep pattern recognition.',
    },
    {
      icon: MessageCircle,
      title: 'Contextual Memory',
      description: 'Our AI remembers your conversations and builds on previous sessions.',
      competitors: 'Most apps treat each session as isolated.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Start your mental wellness journey',
      features: [
        'Daily mood check-ins',
        'Basic journaling',
        'Text reflections',
        'Reset mode (guided breathing)',
        'Limited AI conversations',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'ClearMind Plus',
      price: '$12.99',
      period: '/month',
      annual: '$119/year (save 24%)',
      description: 'Full access to all features',
      features: [
        'Everything in Free',
        'Unlimited AI conversations',
        'Voice mode: talk + listen',
        'Thought Untangler',
        'Advanced pattern insights',
        'Mind mapping visualization',
        'Unlimited journaling',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  ];

  const detailedComparison = [
    { category: 'Pricing', feature: 'Monthly Price', clearmind: '$12.99', calm: '$16.99', headspace: '$12.99', wysa: '$6.25', betterhelp: '$60-90/week' },
    { category: 'Pricing', feature: 'Annual Price', clearmind: '$119/yr', calm: '$79.99/yr', headspace: '$69.99/yr', wysa: '$74.99/yr', betterhelp: '$240-360/mo' },
    { category: 'Pricing', feature: 'Free Tier', clearmind: true, calm: 'Limited', headspace: '14 days', wysa: true, betterhelp: false },
    
    { category: 'AI Features', feature: 'AI Companion', clearmind: true, calm: 'Limited', headspace: true, wysa: true, betterhelp: false },
    { category: 'AI Features', feature: 'Voice Conversations', clearmind: true, calm: false, headspace: false, wysa: false, betterhelp: false },
    { category: 'AI Features', feature: 'Contextual Memory', clearmind: true, calm: false, headspace: false, wysa: 'Limited', betterhelp: true },
    { category: 'AI Features', feature: 'Thought Untangler', clearmind: true, calm: false, headspace: false, wysa: false, betterhelp: false },
    
    { category: 'Content', feature: 'Journaling', clearmind: 'Unlimited', calm: 'Basic', headspace: 'Basic', wysa: 'Basic', betterhelp: false },
    { category: 'Content', feature: 'Mood Tracking', clearmind: true, calm: true, headspace: true, wysa: true, betterhelp: false },
    { category: 'Content', feature: 'Pattern Insights', clearmind: 'Advanced', calm: 'Basic', headspace: 'Basic', wysa: 'Limited', betterhelp: false },
    { category: 'Content', feature: 'Guided Meditations', clearmind: 'Guided Reset', calm: '500+', headspace: '500+', wysa: 'Some', betterhelp: false },
    { category: 'Content', feature: 'Mind Mapping', clearmind: true, calm: false, headspace: false, wysa: false, betterhelp: false },
    
    { category: 'Privacy', feature: 'End-to-End Encryption', clearmind: true, calm: true, headspace: true, wysa: true, betterhelp: true },
    { category: 'Privacy', feature: 'No Data Selling', clearmind: true, calm: true, headspace: true, wysa: true, betterhelp: true },
    { category: 'Privacy', feature: 'Anonymous Option', clearmind: true, calm: false, headspace: false, wysa: true, betterhelp: false },
  ];

  const categories = [...new Set(detailedComparison.map(item => item.category))];

  const renderCellValue = (value: boolean | string, isHighlighted: boolean = false) => {
    if (value === true) {
      return <Check className={`w-5 h-5 mx-auto ${isHighlighted ? 'text-primary' : 'text-green-500'}`} />;
    }
    if (value === false) {
      return <X className="w-5 h-5 mx-auto text-muted-foreground/40" />;
    }
    return <span className={isHighlighted ? 'font-semibold text-primary' : 'text-muted-foreground'}>{value}</span>;
  };

  return (
    <>
      <Helmet>
        <title>Compare ClearMind vs Calm, Headspace, Wysa | Mental Wellness Apps</title>
        <meta name="description" content="See how ClearMind compares to Calm, Headspace, Wysa, and BetterHelp. Compare pricing, features, AI capabilities, and find the best mental wellness app for you." />
        <meta name="keywords" content="ClearMind vs Calm, ClearMind vs Headspace, mental health app comparison, AI therapy app, wellness app pricing" />
        <link rel="canonical" href="https://clearmind.app/compare" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-12 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              #1 AI Mental Wellness Companion
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Why Choose ClearMind?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The only mental wellness app that actually listens to you. 
              Compare features, pricing, and see why users are switching to ClearMind.
            </p>
          </div>
        </section>

        {/* Unique Features */}
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-3">
              What Makes Us Different
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Features you won't find anywhere else
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {uniqueFeatures.map((feature) => (
                <Card key={feature.title} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                        <p className="text-xs text-muted-foreground/60 italic">
                          vs competitors: {feature.competitors}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-3">
              Simple, Honest Pricing
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              No hidden features. No mid-conversation paywalls.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {pricingTiers.map((tier) => (
                <Card 
                  key={tier.name} 
                  className={tier.popular ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-transparent relative' : ''}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle className="flex items-center gap-2">
                      {tier.popular && <Sparkles className="w-5 h-5 text-accent" />}
                      {tier.name}
                    </CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    {tier.annual && (
                      <p className="text-sm text-muted-foreground">{tier.annual}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={tier.popular ? 'glow' : 'outline'} 
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {tier.popular && (
                      <p className="text-center text-xs text-muted-foreground mt-3">
                        7-day free trial • Cancel anytime
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Comparison Table */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-3">
              Feature-by-Feature Comparison
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              See exactly how we stack up against the competition
            </p>

            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[200px] font-semibold">Feature</TableHead>
                    <TableHead className="text-center bg-primary/10 border-x border-primary/20 min-w-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Best Value</Badge>
                        <span className="font-semibold text-foreground">ClearMind</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center min-w-[80px]">Calm</TableHead>
                    <TableHead className="text-center min-w-[80px]">Headspace</TableHead>
                    <TableHead className="text-center min-w-[80px]">Wysa</TableHead>
                    <TableHead className="text-center min-w-[80px]">BetterHelp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <React.Fragment key={category}>
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={6} className="font-semibold text-foreground py-2">
                          {category}
                        </TableCell>
                      </TableRow>
                      {detailedComparison
                        .filter((row) => row.category === category)
                        .map((row, index) => (
                          <TableRow key={row.feature} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                            <TableCell className="text-foreground/80">{row.feature}</TableCell>
                            <TableCell className="text-center bg-primary/5 border-x border-primary/10">
                              {renderCellValue(row.clearmind, true)}
                            </TableCell>
                            <TableCell className="text-center">{renderCellValue(row.calm)}</TableCell>
                            <TableCell className="text-center">{renderCellValue(row.headspace)}</TableCell>
                            <TableCell className="text-center">{renderCellValue(row.wysa)}</TableCell>
                            <TableCell className="text-center">{renderCellValue(row.betterhelp)}</TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="text-xs text-muted-foreground/60 text-center mt-4">
              *Prices and features as of December 2024. Subject to change. BetterHelp pricing varies by therapist.
            </p>
          </div>
        </section>

        {/* Trust Section */}
        <section className="px-6 py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption. Your thoughts stay yours.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No Data Selling</h3>
                <p className="text-sm text-muted-foreground">
                  We never sell your data. Ever. That's a promise.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Available 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Your AI companion is always ready to listen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Find Clarity?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands who've found a better way to manage their mental wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glow" size="lg" onClick={() => navigate('/auth')}>
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Compare;
