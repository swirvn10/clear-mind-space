import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rawInput } = await req.json();
    
    if (!rawInput || typeof rawInput !== 'string' || rawInput.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide your thoughts to untangle' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    console.log("Processing untangle request, input length:", rawInput.length);

    const systemPrompt = `You are a "Thought Untangler" - an expert at helping people organize their scattered, chaotic thoughts into clarity.

When given raw, unstructured thoughts, you will analyze them and return a structured JSON response with the following format:

{
  "themes": [
    {
      "title": "Theme name",
      "description": "Brief description of this theme",
      "thoughts": ["Related thought 1", "Related thought 2"]
    }
  ],
  "connections": [
    {
      "from": "Theme A",
      "to": "Theme B", 
      "relationship": "How they connect"
    }
  ],
  "emotions": [
    {
      "emotion": "Emotion name",
      "intensity": "low|medium|high",
      "source": "What seems to be causing this"
    }
  ],
  "actionItems": [
    {
      "action": "Specific actionable step",
      "priority": "high|medium|low",
      "theme": "Related theme"
    }
  ],
  "priorityFocus": {
    "title": "The one thing to focus on first",
    "reason": "Why this should be the priority"
  },
  "clarityStatement": "A single sentence that captures the essence of what the person is really trying to figure out"
}

Guidelines:
- Extract 2-5 main themes from the thoughts
- Identify genuine emotional undertones without being presumptuous
- Provide concrete, actionable next steps
- The clarity statement should feel like an "aha" moment
- Be compassionate but direct
- If thoughts are too vague, still try to identify patterns

IMPORTANT: Return ONLY valid JSON, no markdown formatting or explanation text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here are my scattered thoughts that need untangling:\n\n${rawInput}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error("Failed to analyze thoughts");
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      console.error("No content in AI response:", data);
      throw new Error("Failed to get analysis from AI");
    }

    console.log("AI response received, parsing JSON...");

    // Try to parse the JSON response
    let analysis;
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanedText = analysisText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", analysisText);
      // Return a fallback structure if parsing fails
      analysis = {
        themes: [{ title: "Your Thoughts", description: "Analysis in progress", thoughts: [rawInput.substring(0, 100)] }],
        connections: [],
        emotions: [],
        actionItems: [{ action: "Try expressing your thoughts in more detail", priority: "medium", theme: "General" }],
        priorityFocus: { title: "Clarity", reason: "Take time to articulate your thoughts more clearly" },
        clarityStatement: "Your thoughts are being processed - try adding more detail for better analysis."
      };
    }

    console.log("Analysis complete with themes:", analysis.themes?.length || 0);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in untangle-thoughts:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to untangle thoughts" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
