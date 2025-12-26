import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Brain, 
  Flame, 
  CloudRain, 
  Scale, 
  Layers, 
  ArrowRight,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StructuredData } from '@/components/seo/StructuredData';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

interface Prompt {
  text: string;
  explanation: string;
}

interface PromptCategory {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  prompts: Prompt[];
}

const promptCategories: PromptCategory[] = [
  {
    icon: CloudRain,
    title: "Overwhelm",
    description: "For when everything feels like too much",
    color: "text-blue-400",
    prompts: [
      { text: "I have too many things on my mind right now", explanation: "Opens space to list and process what's weighing on you" },
      { text: "I feel like I'm drowning in responsibilities", explanation: "Helps identify what's actually urgent vs. what feels urgent" },
      { text: "I don't know where to start", explanation: "Breaks down the paralysis of having too many options" },
      { text: "Everything seems equally important and urgent", explanation: "Guides you through prioritization without judgment" },
      { text: "I can't stop thinking about all the things I need to do", explanation: "Creates mental space by externalizing your to-do list" },
      { text: "I'm overwhelmed by a situation at work", explanation: "Helps separate work stress from personal wellbeing" },
      { text: "I have too many browser tabs open in my brain", explanation: "A playful way to start organizing scattered thoughts" },
      { text: "I need help making sense of this chaos", explanation: "Structured approach to finding clarity in confusion" }
    ]
  },
  {
    icon: Flame,
    title: "Burnout",
    description: "For exhaustion that goes deeper than tired",
    color: "text-orange-400",
    prompts: [
      { text: "I'm running on empty", explanation: "Explores what's draining you and what might restore energy" },
      { text: "I've lost enthusiasm for things I used to enjoy", explanation: "Gently examines changes in motivation and interest" },
      { text: "I feel like I'm just going through the motions", explanation: "Helps reconnect with purpose and meaning" },
      { text: "I'm tired in a way that sleep doesn't fix", explanation: "Distinguishes physical fatigue from emotional exhaustion" },
      { text: "I keep pushing through but I'm not sure why", explanation: "Examines the beliefs driving unsustainable effort" },
      { text: "I feel guilty when I rest", explanation: "Explores the relationship between productivity and self-worth" },
      { text: "I've been neglecting myself lately", explanation: "Opens conversation about self-care without lecture" },
      { text: "I don't remember the last time I felt rested", explanation: "Maps patterns of rest and recovery" }
    ]
  },
  {
    icon: Brain,
    title: "Overthinking",
    description: "For thoughts that won't stop looping",
    color: "text-purple-400",
    prompts: [
      { text: "I can't stop replaying a conversation in my head", explanation: "Processes social anxiety and rumination" },
      { text: "I keep imagining worst-case scenarios", explanation: "Gently challenges catastrophic thinking patterns" },
      { text: "I'm stuck in analysis paralysis", explanation: "Helps move from thinking to deciding" },
      { text: "I'm second-guessing every decision I make", explanation: "Explores the fear underneath the doubt" },
      { text: "I can't turn my brain off at night", explanation: "Creates a mental wind-down before sleep" },
      { text: "I'm worrying about things I can't control", explanation: "Distinguishes between actionable and unactionable concerns" },
      { text: "The same thought keeps coming back", explanation: "Examines what the recurring thought might need" },
      { text: "I'm overthinking something that happened years ago", explanation: "Processes lingering regret or shame" }
    ]
  },
  {
    icon: Scale,
    title: "Decision Fatigue",
    description: "For when choosing feels impossible",
    color: "text-green-400",
    prompts: [
      { text: "Help me think through a decision I'm stuck on", explanation: "Structured approach to weighing options" },
      { text: "I'm afraid of making the wrong choice", explanation: "Explores perfectionism and fear of failure" },
      { text: "I have two options and I can't pick", explanation: "Clarifies what you actually value in each path" },
      { text: "I need to make a big decision and I'm scared", explanation: "Processes the emotions around major life choices" },
      { text: "I keep putting off a decision I need to make", explanation: "Examines what the delay might be protecting" },
      { text: "What if I regret this choice?", explanation: "Explores the relationship between decisions and regret" },
      { text: "I'm torn between what I want and what others expect", explanation: "Separates your values from external pressure" },
      { text: "I made a decision but I'm not sure it was right", explanation: "Processes post-decision doubt" }
    ]
  },
  {
    icon: Layers,
    title: "Mental Load",
    description: "For the invisible weight of managing life",
    color: "text-pink-400",
    prompts: [
      { text: "I'm carrying too much invisible labor", explanation: "Acknowledges the unseen work of keeping life running" },
      { text: "I feel like I'm the only one who notices what needs to be done", explanation: "Explores dynamics of household or team management" },
      { text: "I'm exhausted from being the responsible one", explanation: "Examines the burden of being relied upon" },
      { text: "I need to offload some of what's in my head", explanation: "Creates space for mental decluttering" },
      { text: "I'm the default parent and it's wearing me down", explanation: "Validates the exhaustion of being first responder" },
      { text: "I can't remember the last time I didn't have to think ahead", explanation: "Explores the constant future-planning fatigue" },
      { text: "I'm managing everyone's schedules except my own", explanation: "Helps reclaim space for your own priorities" },
      { text: "I feel like I'm holding everything together alone", explanation: "Validates isolation and explores support options" }
    ]
  }
];

const Prompts = () => {
  return (
    <>
      <Helmet>
        <title>ClearMind Prompts for Mental Clarity | AI Wellness Conversation Starters</title>
        <meta name="description" content="Explore 40+ thoughtful prompts for AI-assisted mental wellness conversations. Topics include overwhelm, burnout, overthinking, decision fatigue, and mental load." />
        <meta property="og:title" content="ClearMind Prompts for Mental Clarity" />
        <meta property="og:description" content="40+ conversation starters for processing emotions, reducing overwhelm, and gaining mental clarity." />
        <link rel="canonical" href="https://clearmind.app/prompts" />
      </Helmet>
      <StructuredData type="prompts" />

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
              <Link to="/auth">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Try These Prompts
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
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">40+ conversation starters</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-foreground">
                ClearMind Prompts for Mental Clarity
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Not sure what to say? Start with one of these prompts. Each is designed to 
                open a meaningful conversation about what you're experiencing.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Prompt Categories */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {promptCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </motion.div>

                <motion.div 
                  variants={staggerContainer}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {category.prompts.map((prompt, promptIndex) => (
                    <motion.article
                      key={promptIndex}
                      variants={fadeInUp}
                      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
                      itemScope
                      itemType="https://schema.org/HowToTip"
                    >
                      <p 
                        className="text-foreground font-medium mb-2 group-hover:text-primary transition-colors"
                        itemProp="text"
                      >
                        "{prompt.text}"
                      </p>
                      <p className="text-sm text-muted-foreground" itemProp="description">
                        {prompt.explanation}
                      </p>
                    </motion.article>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-card/50">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Ready to try one?
            </h2>
            <p className="text-muted-foreground">
              Start a conversation with ClearMind using any of these prompts. 
              The AI will respond with thoughtful questions to help you explore further.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Try ClearMind Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-border">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 ClearMind. Not a replacement for professional therapy.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/ethics" className="hover:text-foreground transition-colors">Ethics</Link>
              <Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Prompts;
