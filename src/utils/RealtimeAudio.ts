import { supabase } from "@/integrations/supabase/client";

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private localStream: MediaStream | null = null;
  
  constructor(
    private onMessage: (message: any) => void,
    private onConnectionChange: (status: 'connecting' | 'connected' | 'disconnected') => void,
    private onSpeakingChange: (isSpeaking: boolean) => void,
    private onTranscript: (text: string, role: 'user' | 'assistant') => void
  ) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async init() {
    try {
      this.onConnectionChange('connecting');
      console.log("Requesting microphone access...");
      
      // Get microphone access
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      console.log("Microphone access granted, getting ephemeral token...");

      // Get ephemeral token from our Edge Function
      const { data, error } = await supabase.functions.invoke("realtime-token");
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error("Failed to get session token");
      }
      
      if (!data?.client_secret?.value) {
        console.error("Invalid response:", data);
        throw new Error("Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log("Ephemeral token received, establishing WebRTC connection...");

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio
      this.pc.ontrack = (e) => {
        console.log("Received remote audio track");
        this.audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      this.pc.addTrack(this.localStream.getTracks()[0]);

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      
      this.dc.addEventListener("open", () => {
        console.log("Data channel opened");
        this.onConnectionChange('connected');
      });

      this.dc.addEventListener("close", () => {
        console.log("Data channel closed");
        this.onConnectionChange('disconnected');
      });

      this.dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        this.handleEvent(event);
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      console.log("Sending SDP offer to OpenAI...");
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`SDP response error: ${sdpResponse.status}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established successfully");

    } catch (error) {
      console.error("Error initializing chat:", error);
      this.onConnectionChange('disconnected');
      throw error;
    }
  }

  private handleEvent(event: any) {
    console.log("Received event:", event.type);
    this.onMessage(event);

    switch (event.type) {
      case 'response.audio.delta':
        this.onSpeakingChange(true);
        break;
      case 'response.audio.done':
        this.onSpeakingChange(false);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        if (event.transcript) {
          this.onTranscript(event.transcript, 'user');
        }
        break;
      case 'response.audio_transcript.done':
        if (event.transcript) {
          this.onTranscript(event.transcript, 'assistant');
        }
        break;
      case 'error':
        console.error("OpenAI Realtime error:", event.error);
        break;
    }
  }

  disconnect() {
    console.log("Disconnecting...");
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    
    this.audioEl.srcObject = null;
    this.onConnectionChange('disconnected');
    this.onSpeakingChange(false);
  }
}
