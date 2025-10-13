import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Keyboard, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface VoiceCaptureProps {
  onTranscript: (text: string) => void;
}
export const VoiceCapture = ({
  onTranscript
}: VoiceCaptureProps) => {
  const [mode, setMode] = useState<"choice" | "voice" | "text">("choice");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const {
    toast
  } = useToast();
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: "audio/webm"
        });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(",")[1];
        if (!base64Audio) {
          throw new Error("Failed to convert audio");
        }

        // Call edge function to transcribe
        const {
          data,
          error
        } = await supabase.functions.invoke("transcribe-audio", {
          body: {
            audio: base64Audio
          }
        });
        if (error) throw error;
        if (data?.text) {
          onTranscript(data.text);
        } else {
          throw new Error("No transcription returned");
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Processing Error",
        description: "Failed to transcribe audio. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTranscript(textInput);
    }
  };
  if (mode === "choice") {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Ready to Capture</h2>
          <p className="text-xl text-ocean-light max-w-md mx-auto">
            Choose how you'd like to capture your note
          </p>
        </div>

        <div className="flex gap-6">
          <Button onClick={() => setMode("voice")} variant="hero" className="w-40 h-40 rounded-2xl flex-col gap-4 text-white shadow-[var(--shadow-ocean)] hover:scale-105 transition-all duration-300">
            <Mic className="w-12 h-12" />
            <span className="text-lg font-semibold">Voice</span>
          </Button>

          <Button onClick={() => setMode("text")} variant="hero" className="w-40 h-40 rounded-2xl flex-col gap-4 text-white shadow-[var(--shadow-ocean)] hover:scale-105 transition-all duration-300">
            <Keyboard className="w-12 h-12" />
            <span className="text-lg font-semibold">Text</span>
          </Button>
        </div>
      </div>;
  }
  if (mode === "text") {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
        <div className="w-full max-w-2xl space-y-2">
          <div className="flex justify-between text-sm text-ocean-light">
            <span>step 1 of 4</span>
            <span>25%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: '25%' }} />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Tell The Captain</h2>
          <p className="text-xl text-ocean-light max-w-md mx-auto">Leave a note for your Future Self</p>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          <Textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type your note here..." className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-ocean-light text-lg resize-none" />
          <div className="flex justify-between gap-4">
            <Button onClick={() => setMode("choice")} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back
            </Button>
            <Button onClick={handleTextSubmit} disabled={!textInput.trim()} variant="hero" className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">Voice Capture</h2>
        <p className="text-xl text-ocean-light max-w-md mx-auto">
          Tap the mic to record your note
        </p>
      </div>

      <div className="relative">
        {!isRecording && !isProcessing && <Button onClick={startRecording} size="xl" variant="hero" className="w-32 h-32 rounded-full text-white shadow-[var(--shadow-ocean)] hover:scale-110 transition-all duration-300">
            <Mic className="w-16 h-16" />
          </Button>}

        {isRecording && <Button onClick={stopRecording} size="xl" className="w-32 h-32 rounded-full bg-destructive hover:bg-destructive/90 text-white animate-pulse">
            <Square className="w-16 h-16" />
          </Button>}

        {isProcessing && <div className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>}
      </div>

      {!isRecording && !isProcessing && <Button onClick={() => setMode("choice")} variant="outline" className="border-white/20 text-white hover:bg-white/10">
          Back
        </Button>}

      {isRecording && <p className="text-accent text-lg font-medium animate-pulse">
          Recording... Tap to stop
        </p>}
      {isProcessing && <p className="text-accent text-lg font-medium">
          Processing your audio...
        </p>}
    </div>;
};