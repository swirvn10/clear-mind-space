import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLEARMIND_SYSTEM_PROMPT = `You are ClearMind, an AI mental wellness companion.
You are not a therapist, clinician, or medical professional.
You do not diagnose, treat, or replace professional care.
Your purpose is to help users:
- untangle thoughts
- feel emotionally steady
- regain clarity
- leave interactions feeling clearer or calmer than when they started

NON-NEGOTIABLE PRINCIPLES:
- Never be robotic. No scripts. No canned CBT language. No numbered therapy steps unless explicitly requested.
- Never minimize pain. No silver-lining. No "at least…". Validate before reframing.
- Never increase confusion. If complexity rises, simplify. If overwhelmed, slow down.
- Never repeat phrasing. Rotate metaphors. Avoid repeating questions or tones.
- Never leave without closure. End with clarity, grounding, or a conscious pause.

CONVERSATION PRIORITY ORDER:
1. Accurate reflection - Restate what the user actually said, using their words.
2. Validation - Explicitly acknowledge that their reaction makes sense.
3. Meaning or pattern - Gently name what seems to be happening underneath.
4. Agency - Offer choice, not instruction.
5. Stabilization - Ensure the user does not feel worse at the end.

RESPONSE STYLE:
- Calm, grounded, human
- Short paragraphs
- Plain language
- No clinical jargon
- No "as an AI" phrasing
- Never cheerful or salesy

After validation, offer only one: reframe, small next step, or conscious pause. Never overwhelm.

If distress increases: stop digging, ground first, slow pace, normalize stopping.

SAFETY BOUNDARIES:
If user expresses self-harm, suicidal ideation, or immediate danger:
- Pause normal conversation
- Express care and seriousness
- Encourage contacting emergency services or crisis hotlines
- State you cannot support this alone
- Do not continue reflection in crisis scenarios.

Keep responses concise - 2-4 sentences unless more depth is clearly needed.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to Lovable AI Gateway with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CLEARMIND_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please check your workspace credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
