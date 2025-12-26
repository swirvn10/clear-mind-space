import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'home' | 'prompts' | 'ethics' | 'experience' | 'comparison';
}

const getHomePageSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ClearMind",
      "applicationCategory": "HealthApplication",
      "applicationSubCategory": "Mental Wellness",
      "operatingSystem": "Web, iOS, Android",
      "description": "AI-powered mental wellness companion for daily emotional support, journaling, mood tracking, and thoughtful conversation. Available 24/7.",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free Tier",
          "price": "0",
          "priceCurrency": "USD",
          "description": "5 AI conversations per day, journaling, mood tracking"
        },
        {
          "@type": "Offer",
          "name": "ClearMind Plus",
          "price": "9.99",
          "priceCurrency": "USD",
          "priceValidUntil": "2026-12-31",
          "description": "Unlimited conversations, voice mode, advanced insights"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "AI therapy conversations",
        "Voice mode with natural speech",
        "Private journaling with AI insights",
        "Daily mood tracking",
        "Thought untangling exercises",
        "End-to-end encryption"
      ],
      "screenshot": "https://clearmind.app/screenshot.png",
      "softwareVersion": "2.0",
      "releaseNotes": "Added voice mode and thought untangler features"
    },
    {
      "@type": "Organization",
      "name": "ClearMind",
      "url": "https://clearmind.app",
      "logo": "https://clearmind.app/icons/icon-512x512.png",
      "description": "Building ethical AI tools for daily mental wellness.",
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@clearmind.app"
      },
      "foundingDate": "2024",
      "knowsAbout": [
        "Mental wellness",
        "AI-powered therapy support",
        "Emotional intelligence",
        "Mindfulness",
        "Cognitive behavioral techniques"
      ]
    },
    {
      "@type": "Product",
      "name": "ClearMind Mental Wellness App",
      "description": "AI companion for mental clarity and emotional processing",
      "brand": {
        "@type": "Brand",
        "name": "ClearMind"
      },
      "category": "Health & Wellness Software",
      "audience": {
        "@type": "Audience",
        "audienceType": "Adults seeking mental wellness support",
        "geographicArea": {
          "@type": "Place",
          "name": "Worldwide"
        }
      },
      "isAccessibleForFree": true,
      "hasVariant": [
        {
          "@type": "Product",
          "name": "ClearMind Free",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "Product",
          "name": "ClearMind Plus",
          "offers": {
            "@type": "Offer",
            "price": "9.99",
            "priceCurrency": "USD"
          }
        }
      ]
    },
    {
      "@type": "WebSite",
      "name": "ClearMind",
      "url": "https://clearmind.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://clearmind.app/prompts?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
});

const getFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

const getHowToSchema = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use ClearMind for Mental Clarity",
  "description": "A step-by-step guide to getting the most from ClearMind's AI mental wellness features.",
  "totalTime": "PT5M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Create your account",
      "text": "Sign up for free with your email. No credit card required."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Start a conversation",
      "text": "Open the chat and share what's on your mind. The AI will respond with thoughtful questions."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Track your mood",
      "text": "Check in daily with the mood tracker to notice patterns over time."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Use the Thought Untangler",
      "text": "When feeling overwhelmed, use this feature to break down complex thoughts into manageable pieces."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Review your insights",
      "text": "Check the insights dashboard to see your emotional patterns and progress."
    }
  ]
});

const getEthicsSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "ClearMind Ethical AI Principles",
  "description": "ClearMind's commitment to ethical AI practices in mental wellness technology.",
  "about": {
    "@type": "Thing",
    "name": "Ethical AI in Mental Health",
    "description": "Principles for responsible AI development in mental wellness applications"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "ClearMind Ethical Commitments",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "No Diagnosis",
        "description": "ClearMind does not diagnose mental health conditions"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Data Privacy",
        "description": "User data is encrypted and never sold to third parties"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "No Emotional Manipulation",
        "description": "AI responses are designed to support, not manipulate emotions"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Transparent Pricing",
        "description": "Clear, honest pricing with meaningful free access"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Crisis Boundaries",
        "description": "Clear escalation to professional resources when needed"
      }
    ]
  }
});

const getPromptsSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "ClearMind Prompts for Mental Clarity",
  "description": "Example prompts for AI-assisted mental wellness conversations",
  "numberOfItems": 40,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "I have too many things on my mind right now",
      "description": "A prompt for processing overwhelm and mental load"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Help me think through a decision I'm stuck on",
      "description": "A prompt for decision fatigue and analysis paralysis"
    }
  ]
});

export const StructuredData: React.FC<StructuredDataProps> = ({ type }) => {
  const getSchema = () => {
    switch (type) {
      case 'home':
        return JSON.stringify(getHomePageSchema());
      case 'prompts':
        return JSON.stringify(getPromptsSchema());
      case 'ethics':
        return JSON.stringify(getEthicsSchema());
      case 'experience':
        return JSON.stringify(getHowToSchema());
      default:
        return JSON.stringify(getHomePageSchema());
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {getSchema()}
      </script>
    </Helmet>
  );
};

export const FAQStructuredData: React.FC<{ faqs: Array<{question: string, answer: string}> }> = ({ faqs }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(getFAQSchema(faqs))}
    </script>
  </Helmet>
);

export default StructuredData;
