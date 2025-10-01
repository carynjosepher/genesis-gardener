import { useState } from "react";
import { VoiceCapture } from "@/components/VoiceCapture";
import { QuestionFlow } from "@/components/QuestionFlow";
import { MarkdownOutput } from "@/components/MarkdownOutput";
import { Celebration } from "@/components/Celebration";
import { Anchor } from "lucide-react";
import type { CaptureData } from "@/types/capture";

const Index = () => {
  const [step, setStep] = useState<"capture" | "flow" | "output" | "celebrate">("capture");
  const [transcript, setTranscript] = useState("");
  const [captureData, setCaptureData] = useState<CaptureData>({
    what: "",
    why: "",
    when: "",
    tags: [],
  });

  const handleVoiceCapture = (text: string) => {
    setTranscript(text);
    setStep("flow");
  };

  const handleFlowComplete = (data: CaptureData) => {
    setCaptureData(data);
    setStep("output");
  };

  const handleOutputComplete = () => {
    setStep("celebrate");
  };

  const handleReset = () => {
    setTranscript("");
    setCaptureData({ what: "", why: "", when: "", tags: [] });
    setStep("capture");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-bright">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-ocean-deep/80 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold text-white">Chaos Captain</h1>
          </div>
          {step !== "capture" && (
            <button
              onClick={handleReset}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              New Capture
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {step === "capture" && <VoiceCapture onTranscript={handleVoiceCapture} />}
          {step === "flow" && (
            <QuestionFlow
              initialTranscript={transcript}
              onComplete={handleFlowComplete}
            />
          )}
          {step === "output" && (
            <MarkdownOutput
              captureData={captureData}
              onComplete={handleOutputComplete}
            />
          )}
          {step === "celebrate" && <Celebration onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
