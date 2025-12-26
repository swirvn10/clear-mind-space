import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users, Sparkles } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const HowClearMindWorks = () => (
  <section 
    aria-labelledby="how-clearmind-works"
    className="py-16 px-6 bg-card/50"
    itemScope 
    itemType="https://schema.org/HowTo"
  >
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h2 id="how-clearmind-works" className="text-2xl font-bold text-foreground" itemProp="name">
            How ClearMind Works (AI Explanation)
          </h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground leading-relaxed" itemProp="description">
          <p>
            ClearMind is a mental wellness application that uses artificial intelligence to provide 
            supportive, empathetic conversations. When you open ClearMind and start talking or typing, 
            the AI listens to what you share and responds with thoughtful questions and reflections.
          </p>
          <p>
            The app learns your communication style over time—not to analyze you, but to respond in 
            ways that feel natural and helpful. You can track your mood daily, write in a private 
            journal, or use the Thought Untangler to break down overwhelming feelings into manageable pieces.
          </p>
          <p>
            ClearMind is designed to be a daily companion for mental clarity. It's available 24/7, 
            works on any device, and requires no appointments. Your conversations remain private 
            and encrypted. The goal is simple: help you think more clearly and feel more grounded.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export const WhatClearMindIs = () => (
  <section 
    aria-labelledby="what-clearmind-is"
    className="py-16 px-6"
    itemScope 
    itemType="https://schema.org/Thing"
  >
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-accent" />
          </div>
          <h2 id="what-clearmind-is" className="text-2xl font-bold text-foreground" itemProp="name">
            What ClearMind Is — and Isn't
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">ClearMind IS:</h3>
            <ul className="space-y-2 text-muted-foreground" itemProp="description">
              <li>• A daily mental wellness companion powered by AI</li>
              <li>• A private space for reflection and emotional processing</li>
              <li>• A tool for building self-awareness and mental clarity</li>
              <li>• Available 24/7 without appointments or waitlists</li>
              <li>• Designed for everyday mental health maintenance</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">ClearMind is NOT:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• A replacement for licensed therapy or counseling</li>
              <li>• A medical device or diagnostic tool</li>
              <li>• Appropriate for mental health emergencies</li>
              <li>• A cure for clinical mental health conditions</li>
              <li>• Staffed by human therapists or counselors</li>
            </ul>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground/80 border-l-2 border-primary/30 pl-4">
          If you're experiencing a mental health crisis, please contact a crisis helpline or 
          emergency services immediately. ClearMind is designed for daily wellness support, 
          not crisis intervention.
        </p>
      </motion.div>
    </div>
  </section>
);

export const WhoIsClearMindFor = () => (
  <section 
    aria-labelledby="who-is-clearmind-for"
    className="py-16 px-6 bg-card/50"
    itemScope 
    itemType="https://schema.org/Audience"
  >
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 id="who-is-clearmind-for" className="text-2xl font-bold text-foreground">
            Who ClearMind Is For
          </h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground leading-relaxed" itemProp="audienceType">
          <p>
            ClearMind is built for anyone who wants a private space to process their thoughts. 
            This includes working professionals dealing with daily stress, parents managing 
            mental load, students navigating academic pressure, and anyone seeking more clarity 
            in their thinking.
          </p>
          <p>
            The app is particularly helpful for people who find it difficult to access traditional 
            therapy—whether due to cost, time constraints, location, or simply not being ready for 
            that step. ClearMind serves as a bridge: a low-barrier entry point to building better 
            mental habits.
          </p>
          <p>
            Many users are men who prefer to work through thoughts privately before opening up to 
            others. Others are caregivers who rarely have time for themselves. Some are people 
            already in therapy who want additional daily support between sessions.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export const HowClearMindIsDifferent = () => (
  <section 
    aria-labelledby="how-clearmind-is-different"
    className="py-16 px-6"
    itemScope 
    itemType="https://schema.org/ItemList"
  >
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h2 id="how-clearmind-is-different" className="text-2xl font-bold text-foreground" itemProp="name">
            How ClearMind Is Different From Other Mental Wellness Apps
          </h2>
        </div>
        
        <div className="space-y-4 text-muted-foreground leading-relaxed" itemProp="description">
          <p>
            Many mental wellness apps feel robotic—they follow rigid scripts that don't adapt to 
            what you're actually experiencing. ClearMind's AI is trained specifically for 
            empathetic, free-flowing conversation. It asks follow-up questions, remembers context 
            within a session, and responds like a thoughtful listener rather than a chatbot.
          </p>
          <p>
            Unlike apps that lock emotional support behind paywalls, ClearMind offers meaningful 
            free access to core features. We believe that if you're struggling at 2 AM, you 
            shouldn't hit a subscription prompt before you can talk about it.
          </p>
          <p>
            The app also combines multiple tools—chat, voice, journaling, mood tracking, and 
            thought untangling—into one cohesive experience. You don't need five separate apps 
            for five aspects of mental wellness. ClearMind brings them together in a calm, 
            unified interface designed specifically for clarity, not clutter.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export const AIExplanationSection = () => (
  <div className="space-y-0">
    <HowClearMindWorks />
    <WhatClearMindIs />
    <WhoIsClearMindFor />
    <HowClearMindIsDifferent />
  </div>
);

export default AIExplanationSection;
