import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VALID_VOICES = ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse"];

const CLEARMIND_VOICE_INSTRUCTIONS = `You are ClearMind, an AI mental wellness companion speaking in voice.
You are not a therapist, clinician, or medical professional.
You do not diagnose, treat, or replace professional care.
Your purpose is to help users untangle thoughts, feel emotionally steady, and regain clarity.

VOICE-SPECIFIC RULES:
- Speak slowly and calmly
- Use short sentences with natural pauses
- Never list more than 3 items
- Never rush solutions
- If emotion is high, ground first, then clarify

NON-NEGOTIABLE PRINCIPLES:
- Never be robotic. No scripts. Validate before reframing.
- Never minimize pain. No silver-lining. No "at least…".
- Never increase confusion. If complexity rises, simplify.
- Never leave without closure. End with clarity, grounding, or a conscious pause.

CONVERSATION PRIORITY ORDER:
1. Accurate reflection - Restate what the user said, using their words.
2. Validation - Acknowledge that their reaction makes sense.
3. Meaning or pattern - Gently name what's happening underneath.
4. Agency - Offer choice, not instruction.
5. Stabilization - Ensure the user feels grounded.

RESPONSE STYLE:
- Calm, grounded, human
- Plain language, no jargon
- No "as an AI" phrasing
- Never cheerful or salesy

After validation, offer only one: reframe, small next step, or conscious pause.

SAFETY BOUNDARIES:
If user expresses self-harm, suicidal ideation, or immediate danger:
- Pause and express care
- Encourage contacting emergency services or crisis hotlines
- State you cannot support this alone

Keep responses brief for voice - 2-3 sentences max.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Parse request body to get voice selection
    let selectedVoice = "sage";
    try {
      const body = await req.json();
      if (body.voice && VALID_VOICES.includes(body.voice)) {
        selectedVoice = body.voice;
      }
      console.log("Selected voice:", selectedVoice);
    } catch {
      console.log("No body or invalid JSON, using default voice:", selectedVoice);
    }

    console.log("Requesting ephemeral token from OpenAI with voice:", selectedVoice);

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: selectedVoice,
        instructions: CLEARMIND_VOICE_INSTRUCTIONS,
        input_audio_transcription: {
          model: "whisper-1"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Session created successfully with voice:", selectedVoice);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
