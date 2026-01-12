import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Shield, 
  Lock, 
  Heart, 
  DollarSign, 
  AlertTriangle,
  Sparkles,
  Check,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StructuredData } from '@/components/seo/StructuredData';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const principles = [
  {
    icon: Shield,
    title: "No Diagnosis",
    description: "ClearMind will never diagnose mental health conditions",
    details: [
      "We do not provide medical or psychiatric diagnoses",
      "The AI is trained to recognize when professional help may be needed",
      "We clearly communicate that ClearMind is a wellness tool, not a clinical service",
      "We encourage users to seek professional care for clinical concerns"
    ]
  },
  {
    icon: Lock,
    title: "Your Data Stays Yours",
    description: "We don't sell, share, or use your conversations to train AI",
    details: [
      "All conversations are encrypted end-to-end",
      "Your data is never sold to third parties",
      "We don't use your conversations to train our AI models",
      "You can export or delete your data at any time",
      "We minimize data collection to only what's necessary"
    ]
  },
  {
    icon: Heart,
    title: "No Emotional Manipulation",
    description: "Our AI is designed to support, not exploit your emotions",
    details: [
      "No dark patterns or guilt-based prompts to increase engagement",
      "No artificial urgency or fear-based messaging",
      "Responses are designed to help you think clearly, not create dependency",
      "We don't use psychological tricks to drive subscription upgrades",
      "The AI acknowledges its limitations honestly"
    ]
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Clear costs, meaningful free access, no hidden fees",
    details: [
      "Free tier includes real, useful features—not just a trial",
      "Premium pricing is displayed clearly without manipulative discounts",
      "No lock-in contracts or difficult cancellation processes",
      "We believe emotional support shouldn't be paywalled at 2 AM",
      "Pricing is consistent across all platforms"
    ]
  },
  {
    icon: AlertTriangle,
    title: "Crisis Boundaries",
    description: "We know when to step back and direct you to professional help",
    details: [
      "ClearMind recognizes language that suggests crisis situations",
      "We provide immediate links to crisis resources when appropriate",
      "We clearly communicate that ClearMind is not for emergencies",
      "The AI is trained to de-escalate and encourage professional support",
      "We maintain an updated list of crisis helplines by region"
    ]
  }
];

const Ethics = () => {
  return (
    <>
      <Helmet>
        <title>ClearMind's Ethical AI Principles | Mental Wellness Technology Ethics</title>
        <meta name="description" content="ClearMind's commitment to ethical AI in mental wellness: no diagnosis, no data selling, no emotional manipulation, transparent pricing, and clear crisis boundaries." />
        <meta name="keywords" content="ethical AI, mental wellness ethics, AI privacy, transparent pricing, mental health technology, responsible AI" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ClearMind" />
        <link rel="canonical" href="https://clearmind.app/ethics" />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://clearmind.app/ethics" />
        <meta property="og:title" content="ClearMind's Ethical AI Principles" />
        <meta property="og:description" content="How we build AI for mental wellness responsibly: privacy, transparency, and user wellbeing first." />
        <meta property="og:site_name" content="ClearMind" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ClearMind's Ethical AI Principles" />
        <meta name="twitter:description" content="How we build AI for mental wellness responsibly: privacy, transparency, and user wellbeing first." />
      </Helmet>
      <StructuredData type="ethics" />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">ClearMind</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/prompts" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Prompts
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Our commitments to you</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-foreground">
                ClearMind's Ethical AI Principles
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Mental wellness technology comes with responsibility. Here's how we hold ourselves 
                accountable to the people who trust us with their thoughts.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {principles.map((principle, index) => (
              <motion.article
                key={principle.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-card border border-border"
                itemScope
                itemType="https://schema.org/Article"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <principle.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground" itemProp="headline">
                      {principle.title}
                    </h2>
                    <p className="text-muted-foreground mt-1" itemProp="description">
                      {principle.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 pl-16" itemProp="articleBody">
                  {principle.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Not a Medical Device */}
        <section className="py-16 px-6 bg-card/50">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <AlertTriangle className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">
              Important: ClearMind Is Not a Medical Device
            </h2>
            <div className="text-muted-foreground space-y-4 text-left">
              <p>
                ClearMind is designed for general mental wellness support and self-reflection. 
                It is not intended to diagnose, treat, cure, or prevent any mental health condition.
              </p>
              <p>
                If you are experiencing thoughts of self-harm, severe depression, psychosis, 
                or any mental health emergency, please contact emergency services or a 
                crisis helpline immediately.
              </p>
              <p>
                ClearMind is meant to complement, not replace, care from licensed mental 
                health professionals. We encourage all users to seek appropriate professional 
                support when needed.
              </p>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Built on Trust
            </h2>
            <p className="text-muted-foreground">
              These aren't just marketing promises. They're the foundation of how we build 
              and operate ClearMind. If we ever fail to meet these standards, we want to hear about it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Experience ClearMind
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/prompts">
                <Button variant="outline" size="lg">
                  Browse Prompts
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 ClearMind. Not a replacement for professional therapy.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/prompts" className="hover:text-foreground transition-colors">Prompts</Link>
              <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Ethics;
