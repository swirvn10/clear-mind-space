import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  MessageCircle, 
  Mic, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Sparkles,
  ChevronDown,
  Star,
  Check,
  ArrowRight,
  Brain,
  Heart,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const features = [
  {
    icon: MessageCircle,
    title: "AI Therapy Chat",
    description: "Have meaningful conversations with an AI trained to listen, understand, and help you process your thoughts."
  },
  {
    icon: Mic,
    title: "Voice Mode",
    description: "Speak naturally and receive empathetic responses. Perfect for when typing feels like too much."
  },
  {
    icon: BookOpen,
    title: "Private Journal",
    description: "Write freely with AI-powered insights that help you understand patterns in your thoughts and emotions."
  },
  {
    icon: TrendingUp,
    title: "Mood Tracking",
    description: "Track your emotional journey over time and discover what influences your wellbeing."
  },
  {
    icon: Brain,
    title: "Thought Untangler",
    description: "Break down overwhelming thoughts into manageable pieces with guided reflection."
  },
  {
    icon: Shield,
    title: "Complete Privacy",
    description: "Your conversations are encrypted and never used to train AI. Your mind, your data."
  }
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    avatar: "S",
    content: "ClearMind helped me through a really tough time at work. Having someone to talk to at 2am when anxiety hits different is invaluable.",
    rating: 5
  },
  {
    name: "James K.",
    role: "Software Engineer",
    avatar: "J",
    content: "I was skeptical about AI therapy, but the conversations feel surprisingly genuine. It's helped me build better emotional awareness.",
    rating: 5
  },
  {
    name: "Maya P.",
    role: "Graduate Student",
    avatar: "M",
    content: "The journal feature with AI insights is amazing. It helped me notice patterns in my stress that I'd completely missed.",
    rating: 5
  },
  {
    name: "David L.",
    role: "Entrepreneur",
    avatar: "D",
    content: "Voice mode is a game-changer. Sometimes I just need to vent, and ClearMind listens without judgment.",
    rating: 5
  },
  {
    name: "Emma R.",
    role: "Healthcare Worker",
    avatar: "E",
    content: "After long shifts, I don't have energy for apps with complicated features. ClearMind is simple, calming, and always there.",
    rating: 5
  },
  {
    name: "Alex T.",
    role: "Teacher",
    avatar: "A",
    content: "The thought untangler helped me work through anxiety about a big presentation. Broke it all down step by step.",
    rating: 5
  }
];

const faqs = [
  {
    question: "Is ClearMind a replacement for therapy?",
    answer: "ClearMind is designed to complement, not replace, professional mental health care. It's a supportive tool for daily emotional wellness, self-reflection, and building healthy habits. For serious mental health concerns, we always recommend consulting with a licensed therapist."
  },
  {
    question: "How is my privacy protected?",
    answer: "Your privacy is our top priority. All conversations are encrypted end-to-end, stored securely, and never used to train AI models. You can export or delete your data at any time. We don't sell or share your personal information with third parties."
  },
  {
    question: "What makes ClearMind different from other mental health apps?",
    answer: "ClearMind combines AI-powered conversations, journaling, mood tracking, and thought analysis in one seamless experience. Unlike chatbots that feel robotic, our AI is trained specifically for empathetic, meaningful dialogue that adapts to your unique needs."
  },
  {
    question: "Can I use ClearMind offline?",
    answer: "ClearMind is a Progressive Web App (PWA) that works offline for journaling and reviewing past entries. AI conversations require an internet connection, but your data syncs automatically when you're back online."
  },
  {
    question: "Is there a free version?",
    answer: "Yes! ClearMind offers a generous free tier with daily AI conversations, journaling, and mood tracking. Premium features like voice mode, advanced insights, and unlimited conversations are available with ClearMind Plus."
  },
  {
    question: "How does the AI understand emotions?",
    answer: "Our AI is trained on therapeutic dialogue patterns and emotional intelligence frameworks. It recognizes emotional cues, asks thoughtful follow-up questions, and provides responses grounded in evidence-based approaches like CBT and mindfulness."
  }
];

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>ClearMind - Your AI Mental Wellness Companion</title>
        <meta name="description" content="Experience AI-powered therapy conversations, private journaling, mood tracking, and mindful exercises. Your 24/7 mental wellness companion." />
        <meta property="og:title" content="ClearMind - Your AI Mental Wellness Companion" />
        <meta property="og:description" content="Experience AI-powered therapy conversations, private journaling, mood tracking, and mindful exercises." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://clearmind.app" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-hidden">
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">ClearMind</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/compare" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Compare
              </Link>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Your mental wellness matters</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-display font-bold text-foreground leading-tight"
              >
                Clear your mind.
                <br />
                <span className="text-primary">Find your peace.</span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-lg sm:text-body-lg text-muted-foreground max-w-2xl mx-auto"
              >
                An AI companion that listens without judgment, helps you process emotions, 
                and supports your journey to better mental health — available 24/7.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <Link to="/auth">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/compare">
                  <Button variant="outline" size="lg" className="gap-2 px-8 py-6 text-lg rounded-xl border-border hover:bg-secondary/50 transition-all duration-300">
                    See How We Compare
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex items-center justify-center gap-6 pt-8 text-muted-foreground text-sm"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Private & secure</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-heading font-bold text-foreground mb-4">
                Everything you need for mental clarity
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful tools designed with empathy, built for your unique journey.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-6 bg-surface-elevated/30">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm text-accent">Loved by thousands</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-heading font-bold text-foreground mb-4">
                Real stories, real impact
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how ClearMind is helping people take control of their mental wellness.
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50K+", label: "Active Users" },
                { value: "1M+", label: "Conversations" },
                { value: "4.9", label: "App Rating" },
                { value: "24/7", label: "Availability" }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  variants={scaleIn}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-heading font-bold text-foreground mb-4">
                Frequently asked questions
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg">
                Everything you need to know about ClearMind.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors duration-300"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary transition-colors py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6">
              <Moon className="w-5 h-5 text-primary" />
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to find your clarity?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands who've discovered a better way to manage stress, 
              process emotions, and build lasting mental wellness habits.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/auth">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-10 py-7 text-lg rounded-xl shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                  Start Free Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeInUp} className="mt-6 text-sm text-muted-foreground">
              No credit card required • Cancel anytime
            </motion.p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="text-lg font-semibold text-foreground">ClearMind</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 ClearMind. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
