import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { averageMood, moodTrends, totalConversations, totalJournalEntries, currentStreak, commonWords } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context for the AI
    const moodDescription = averageMood >= 4 ? "quite positive" : averageMood >= 3 ? "balanced" : averageMood >= 2 ? "a bit low" : "challenging";
    const streakNote = currentStreak > 0 ? `They've maintained a ${currentStreak}-day streak of checking in.` : "They're just getting started with regular check-ins.";
    const themesNote = commonWords.length > 0 
      ? `Common themes in their journaling include: ${commonWords.map((w: any) => w.word).join(", ")}.` 
      : "They haven't written much in their journal yet.";
    const activityNote = `They've had ${totalConversations} conversations and written ${totalJournalEntries} journal entries.`;

    const prompt = `You are ClearMind, a gentle and supportive mental wellness companion. Based on the following user data from the past week, write a brief, warm, and encouraging reflection (2-3 short paragraphs, about 100 words total).

User's week summary:
- Average mood: ${averageMood}/5 (${moodDescription})
- ${streakNote}
- ${activityNote}
- ${themesNote}

Guidelines:
- Be warm and conversational, not clinical
- Acknowledge their efforts and any patterns you notice
- Offer one gentle suggestion or encouragement for the coming week
- Keep it personal and supportive
- Don't use bullet points or headers, write in flowing prose
- Sign off warmly as ClearMind`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("Failed to generate insights");
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "Unable to generate summary at this time.";

    console.log("Generated insights summary successfully");

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-insights function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
