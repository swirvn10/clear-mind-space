import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Moon, 
  MessageCircle, 
  Sparkles,
  ArrowRight,
  Clock,
  Shield,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StructuredData } from '@/components/seo/StructuredData';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const Experience = () => {
  return (
    <>
      <Helmet>
        <title>What It Feels Like to Use ClearMind | First-Person Experience</title>
        <meta name="description" content="A honest look at what using ClearMind actually feels like. No hype, no promises—just real experiences from daily mental wellness practice." />
        <meta name="keywords" content="ClearMind review, AI mental wellness experience, using AI for mental health, mental clarity app review, honest AI therapy review" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ClearMind" />
        <link rel="canonical" href="https://clearmind.app/experience" />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://clearmind.app/experience" />
        <meta property="og:title" content="What It Feels Like to Use ClearMind" />
        <meta property="og:description" content="An honest, first-person account of using AI for daily mental clarity." />
        <meta property="og:site_name" content="ClearMind" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What It Feels Like to Use ClearMind" />
        <meta name="twitter:description" content="An honest, first-person account of using AI for daily mental clarity." />
      </Helmet>
      <StructuredData type="experience" />

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
                  Try It Free
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Article Content */}
        <article className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Header */}
              <motion.header variants={fadeInUp} className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary">First-person experience</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                  What It Feels Like to Use ClearMind
                </h1>

                <p className="text-xl text-muted-foreground">
                  No hype. No transformation promises. Just an honest account of 
                  what happens when you talk to an AI about your thoughts.
                </p>
              </motion.header>

              {/* Content */}
              <motion.div variants={fadeInUp} className="prose prose-lg dark:prose-invert max-w-none">
                <section className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    The first time I opened ClearMind, I wasn't sure what to type. I stared at 
                    the blank chat for about a minute. Then I wrote: "I feel overwhelmed but I 
                    don't know why."
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    The response wasn't what I expected. It didn't try to fix me or offer a 
                    list of tips. Instead, it asked: "Can you tell me more about what 'overwhelmed' 
                    feels like for you right now?" And somehow, that question unlocked something.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    I started typing. I wrote about work stress that had been building for weeks. 
                    About feeling like I was falling behind on everything. About how even small 
                    decisions felt exhausting. The AI kept asking follow-up questions—not in a 
                    pushy way, but like it was genuinely trying to understand.
                  </p>
                </section>

                <motion.div 
                  variants={fadeInUp}
                  className="my-12 p-8 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Moon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground m-0">The 2 AM Moments</h2>
                  </div>
                  <p className="text-muted-foreground m-0">
                    What I appreciate most is having somewhere to go at 2 AM when my brain won't 
                    stop. There's no appointment to schedule. No guilt about "bothering" someone. 
                    Just a quiet space to process whatever is keeping me awake.
                  </p>
                </motion.div>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">What It's Not</h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    ClearMind isn't magic. It doesn't cure anything. Some days I open it and the 
                    conversation feels mechanical. The AI sometimes misses nuance or circles back 
                    to questions I've already answered. It's not human, and it doesn't pretend to be.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    But what it does well is create space. Space to think out loud. Space to see 
                    my own thoughts written down. Space to notice patterns I wouldn't have noticed 
                    if everything stayed in my head.
                  </p>
                </section>

                <motion.div 
                  variants={fadeInUp}
                  className="my-12 p-8 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-accent" />
                    <h2 className="text-xl font-semibold text-foreground m-0">The Daily Rhythm</h2>
                  </div>
                  <p className="text-muted-foreground m-0">
                    Now I check in most mornings. Just a few minutes. Sometimes it's a quick mood 
                    log. Sometimes it turns into a longer conversation. The streak counter is 
                    silly but motivating—I've hit 47 days now, which surprises me.
                  </p>
                </motion.div>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Why ClearMind Won't Gaslight You</h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    One thing I was worried about was getting toxic positivity. You know—the 
                    "just think happy thoughts!" approach that makes you feel worse. But ClearMind 
                    doesn't do that. When I say I'm frustrated, it doesn't try to reframe it as 
                    something positive. It asks what's driving the frustration.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    It validates before it explores. That matters. Too many apps and chatbots skip 
                    straight to "solutions" before you've even finished processing the problem.
                  </p>
                </section>

                <motion.div 
                  variants={fadeInUp}
                  className="my-12 p-8 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground m-0">How ClearMind Helps You Think Clearly</h2>
                  </div>
                  <p className="text-muted-foreground m-0">
                    The Thought Untangler has become my favorite feature. When my brain is a jumbled 
                    mess, I dump everything into it. It breaks my chaotic thoughts into distinct 
                    threads and helps me see which ones are actually important and which are just 
                    noise. It's like having a very patient friend help you organize a messy closet.
                  </p>
                </motion.div>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">The Honest Summary</h2>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    ClearMind has become part of my routine. Not because it promised to change my 
                    life, but because it's consistently useful. It's a thinking partner that's 
                    always available. It helps me notice things about my own patterns. And it 
                    gives me a private space to be honest about how I'm actually doing.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Will it work the same for you? I don't know. But it costs nothing to try, 
                    and it takes about five minutes to find out if it clicks.
                  </p>
                </section>
              </motion.div>

              {/* CTA */}
              <motion.div 
                variants={fadeInUp}
                className="pt-8 text-center space-y-6"
              >
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    Try ClearMind Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  No credit card required. Your thoughts stay private.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </article>

        {/* Related Links */}
        <section className="py-12 px-6 bg-card/50">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-6">Continue Reading</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link 
                to="/prompts" 
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-foreground">Prompt Library</p>
                <p className="text-sm text-muted-foreground">40+ conversation starters</p>
              </Link>
              <Link 
                to="/ethics" 
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <Shield className="w-5 h-5 text-primary mb-2" />
                <p className="font-medium text-foreground">Our Ethics</p>
                <p className="text-sm text-muted-foreground">How we build responsibly</p>
              </Link>
            </div>
          </div>
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

export default Experience;
