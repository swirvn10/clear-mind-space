import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { 
  Check, 
  X, 
  Sparkles, 
  Mic, 
  Brain, 
  Shield, 
  Heart,
  ArrowRight,
  Star,
  Clock,
  MessageCircle,
  TrendingUp,
  ChevronDown
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const floatAnimation = {
  y: [0, -6, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

// Scroll-triggered section wrapper
const AnimatedSection: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

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

  const trustFeatures = [
    { icon: Shield, title: 'Privacy First', description: 'End-to-end encryption. Your thoughts stay yours.' },
    { icon: Heart, title: 'No Data Selling', description: 'We never sell your data. Ever. That\'s a promise.' },
    { icon: Clock, title: 'Available 24/7', description: 'Your AI companion is always ready to listen.' },
  ];

  const categories = [...new Set(detailedComparison.map(item => item.category))];

  const renderCellValue = (value: boolean | string, isHighlighted: boolean = false) => {
    if (value === true) {
      return (
        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
          <Check className={`w-5 h-5 mx-auto ${isHighlighted ? 'text-primary' : 'text-green-500'}`} />
        </motion.div>
      );
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

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-12 bg-gradient-to-b from-primary/5 to-transparent relative">
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div 
            className="max-w-4xl mx-auto text-center relative z-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="mb-4 hover:scale-105 transition-transform cursor-default">
                <Star className="w-3 h-3 mr-1" />
                #1 AI Mental Wellness Companion
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Why Choose ClearMind?
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The only mental wellness app that actually listens to you. 
              Compare features, pricing, and see why users are switching to ClearMind.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div 
              className="mt-12"
              variants={fadeIn}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center text-muted-foreground/50"
              >
                <span className="text-xs mb-1">Scroll to explore</span>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Unique Features */}
        <AnimatedSection className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-10"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-2xl font-semibold text-foreground mb-3"
              >
                What Makes Us Different
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-muted-foreground max-w-xl mx-auto"
              >
                Features you won't find anywhere else
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {uniqueFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group h-full">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <feature.icon className="w-6 h-6 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                          <p className="text-xs text-muted-foreground/60 italic">
                            vs competitors: {feature.competitors}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Pricing Section */}
        <AnimatedSection className="px-6 py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-10"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-2xl font-semibold text-foreground mb-3"
              >
                Simple, Honest Pricing
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-muted-foreground"
              >
                No hidden features. No mid-conversation paywalls.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  variants={scaleIn}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className={`h-full transition-all duration-300 ${
                      tier.popular 
                        ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-transparent relative shadow-lg shadow-primary/10' 
                        : 'hover:border-border'
                    }`}
                  >
                    {tier.popular && (
                      <motion.div 
                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Badge className="bg-primary text-primary-foreground">
                          <motion.span animate={floatAnimation}>
                            <Sparkles className="w-3 h-3 mr-1" />
                          </motion.span>
                          Most Popular
                        </Badge>
                      </motion.div>
                    )}
                    <CardHeader className="pt-8">
                      <CardTitle className="flex items-center gap-2">
                        {tier.popular && (
                          <motion.div animate={floatAnimation}>
                            <Sparkles className="w-5 h-5 text-accent" />
                          </motion.div>
                        )}
                        {tier.name}
                      </CardTitle>
                      <div className="mt-2">
                        <motion.span 
                          className="text-4xl font-bold text-foreground"
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        >
                          {tier.price}
                        </motion.span>
                        <span className="text-muted-foreground">{tier.period}</span>
                      </div>
                      {tier.annual && (
                        <p className="text-sm text-muted-foreground">{tier.annual}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, featureIndex) => (
                          <motion.li 
                            key={feature} 
                            className="flex items-start gap-3 text-sm text-foreground/80"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + featureIndex * 0.05 }}
                          >
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant={tier.popular ? 'glow' : 'outline'} 
                          className="w-full group"
                          onClick={() => navigate('/auth')}
                        >
                          {tier.cta}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                      {tier.popular && (
                        <p className="text-center text-xs text-muted-foreground mt-3">
                          7-day free trial • Cancel anytime
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Detailed Comparison Table */}
        <AnimatedSection className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-10"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-2xl font-semibold text-foreground mb-3"
              >
                Feature-by-Feature Comparison
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-muted-foreground"
              >
                See exactly how we stack up against the competition
              </motion.p>
            </motion.div>

            <motion.div 
              className="overflow-x-auto rounded-xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
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
                          <motion.tr
                            key={row.feature}
                            className={`${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'} hover:bg-muted/20 transition-colors`}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <TableCell className="text-foreground/80">{row.feature}</TableCell>
                            <TableCell className="text-center bg-primary/5 border-x border-primary/10">
                              {renderCellValue(row.clearmind, true)}
                            </TableCell>
                            <TableCell className="text-center">{renderCellValue(row.calm)}</TableCell>
                            <TableCell className="text-center">{renderCellValue(row.headspace)}</TableCell>
                            <TableCell className="text-center">{renderCellValue(row.wysa)}</TableCell>
                            <TableCell className="text-center">{renderCellValue(row.betterhelp)}</TableCell>
                          </motion.tr>
                        ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </motion.div>

            <motion.p 
              className="text-xs text-muted-foreground/60 text-center mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              *Prices and features as of December 2024. Subject to change. BetterHelp pricing varies by therapist.
            </motion.p>
          </div>
        </AnimatedSection>

        {/* Trust Section */}
        <AnimatedSection className="px-6 py-16 bg-muted/20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {trustFeatures.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="px-6 py-20">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-foreground mb-4"
            >
              Ready to Find Clarity?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-muted-foreground mb-8"
            >
              Join thousands who've found a better way to manage their mental wellness.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="glow" size="lg" onClick={() => navigate('/auth')} className="group">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Compare;
