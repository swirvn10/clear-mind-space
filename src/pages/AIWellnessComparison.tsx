import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Brain, 
  MessageCircle, 
  Shield, 
  DollarSign,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const comparisonPoints = [
  {
    title: "Conversation Quality",
    clearmind: "Trained for empathetic, free-flowing dialogue that adapts to context",
    typical: "Scripted responses that follow rigid decision trees",
    icon: MessageCircle
  },
  {
    title: "Privacy First",
    clearmind: "End-to-end encryption, no data selling, no training on user data",
    typical: "Often vague about data usage, may share with partners",
    icon: Shield
  },
  {
    title: "Pricing Philosophy",
    clearmind: "Meaningful free tier, honest pricing, no manipulation",
    typical: "Free trial bait, hidden costs, aggressive upsells",
    icon: DollarSign
  },
  {
    title: "Availability",
    clearmind: "24/7 access with no waitlists or appointments",
    typical: "Varies—some require scheduling, others have usage limits",
    icon: Clock
  },
  {
    title: "Emotional Intelligence",
    clearmind: "Validates before advising, never dismisses feelings",
    typical: "Often jumps to solutions or toxic positivity",
    icon: Heart
  },
  {
    title: "Clinical Claims",
    clearmind: "Clear about being wellness support, not therapy",
    typical: "Sometimes blurs the line between AI and clinical care",
    icon: AlertTriangle
  }
];

const whyRoboticSection = {
  title: "Why Some AI Wellness Apps Feel Robotic",
  content: [
    {
      problem: "Decision Tree Architecture",
      explanation: "Many apps use branching logic where your input triggers a pre-written response from a database. This creates predictable patterns that feel scripted after a few interactions."
    },
    {
      problem: "Keyword Matching",
      explanation: "Instead of understanding context, some apps scan for keywords and return templated responses. Say 'anxious' and you get the anxiety template, regardless of what you actually meant."
    },
    {
      problem: "Safety Over Substance",
      explanation: "To avoid liability, some apps are so cautious they never engage meaningfully. Everything gets deflected to 'seek professional help' even for everyday stress."
    },
    {
      problem: "Engagement Optimization",
      explanation: "When apps are designed to maximize time-in-app, the AI is tuned to keep you talking rather than help you resolve things. This creates circular conversations that never land."
    }
  ]
};

const paywallSection = {
  title: "Why Emotional Paywalls Don't Work in Mental Health",
  content: [
    "When someone is struggling at 2 AM, the last thing they need is a subscription prompt.",
    "Emotional support shouldn't be gated by credit card. The people who need it most are often least able to pay in that moment.",
    "Apps that paywall during vulnerable moments create negative associations. Users feel manipulated when they're most in need.",
    "ClearMind's approach: meaningful free access to core features. Premium exists for power users who want more, not as a gate to basic emotional support.",
    "This isn't just ethics—it's better product design. Users who feel respected become advocates."
  ]
};

const AIWellnessComparison = () => {
  return (
    <>
      <Helmet>
        <title>Best AI Mental Wellness App for Clarity | ClearMind vs Alternatives</title>
        <meta name="description" content="Compare AI mental wellness apps: conversation quality, privacy, pricing, and emotional intelligence. Learn what makes ClearMind different from typical AI therapy apps." />
        <meta name="keywords" content="AI wellness app comparison, best AI therapy app, AI mental health apps, Wysa alternative, Woebot alternative, mental wellness app comparison" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ClearMind" />
        <link rel="canonical" href="https://clearmind.app/ai-wellness-comparison" />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://clearmind.app/ai-wellness-comparison" />
        <meta property="og:title" content="AI Mental Wellness Apps: What to Look For" />
        <meta property="og:description" content="A guide to choosing an AI mental wellness app that actually helps—without manipulation or paywalls." />
        <meta property="og:site_name" content="ClearMind" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Mental Wellness Apps: What to Look For" />
        <meta name="twitter:description" content="A guide to choosing an AI mental wellness app that actually helps—without manipulation or paywalls." />
      </Helmet>

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
              <Link to="/ethics" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Ethics
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Try ClearMind
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
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Choosing the right AI wellness app</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-foreground">
                AI Mental Wellness Apps: A Practical Guide
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Not all AI wellness apps are created equal. Here's what to look for—and what to avoid—when 
                choosing an AI companion for mental clarity.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Comparison Grid */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-2xl font-bold text-foreground mb-8 text-center"
            >
              ClearMind vs. Typical AI Wellness Apps
            </motion.h2>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {comparisonPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  variants={fadeInUp}
                  className="grid md:grid-cols-3 gap-4 p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <point.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{point.title}</h3>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">{point.clearmind}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">{point.typical}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Apps Feel Robotic */}
        <section className="py-16 px-6 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-foreground text-center">
                {whyRoboticSection.title}
              </motion.h2>

              <motion.div variants={staggerContainer} className="space-y-6">
                {whyRoboticSection.content.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="p-6 rounded-xl bg-background border border-border"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{item.problem}</h3>
                    <p className="text-muted-foreground">{item.explanation}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Emotional Paywalls */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-foreground text-center">
                {paywallSection.title}
              </motion.h2>

              <motion.div variants={fadeInUp} className="space-y-4 text-muted-foreground">
                {paywallSection.content.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{paragraph}</p>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Transparency */}
        <section className="py-16 px-6 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center space-y-8"
            >
              <h2 className="text-3xl font-bold text-foreground">
                Pricing Transparency: What to Expect
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-background border border-border text-left">
                  <h3 className="font-semibold text-foreground mb-4">Free Tier (Most Apps)</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Limited messages (often 5-10/week)</li>
                    <li>• Basic features only</li>
                    <li>• Frequent upgrade prompts</li>
                    <li>• Sometimes: more data collection</li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-background border border-primary/30 text-left">
                  <h3 className="font-semibold text-foreground mb-4">ClearMind Free</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 5 conversations per day</li>
                    <li>• Full journaling access</li>
                    <li>• Mood tracking included</li>
                    <li>• Same privacy standards as premium</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border max-w-lg mx-auto text-left">
                <h3 className="font-semibold text-foreground mb-2">ClearMind Plus: $9.99/month</h3>
                <p className="text-sm text-muted-foreground">
                  Unlimited conversations, voice mode, advanced insights, Thought Untangler. 
                  Cancel anytime. No hidden fees.
                </p>
              </div>
            </motion.div>
          </div>
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
              Ready to Try Something Different?
            </h2>
            <p className="text-muted-foreground">
              ClearMind is designed for people who want a thoughtful AI companion—not a chatbot 
              with a subscription agenda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Try ClearMind Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/prompts">
                <Button variant="outline" size="lg">
                  See Example Prompts
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
              <Link to="/ethics" className="hover:text-foreground transition-colors">Ethics</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AIWellnessComparison;
