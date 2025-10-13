import { useState, useEffect } from "react";
import { VoiceCapture } from "@/components/VoiceCapture";
import { QuestionFlow } from "@/components/QuestionFlow";
import { MarkdownOutput } from "@/components/MarkdownOutput";
import { Celebration } from "@/components/Celebration";
import { ShortcutSetup } from "@/components/ShortcutSetup";
import { Anchor, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CaptureData } from "@/types/capture";

const Index = () => {
  const navigate = useNavigate();
  const [showShortcutSetup, setShowShortcutSetup] = useState(false);
  const [step, setStep] = useState<"capture" | "flow" | "output" | "celebrate">("capture");
  const [transcript, setTranscript] = useState("");
  const [captureData, setCaptureData] = useState<CaptureData>({
    what: "",
    why: "",
    when: "",
    tags: [],
  });

  useEffect(() => {
    // Check if shortcut setup has been completed
    const setupComplete = localStorage.getItem("shortcut_setup_complete");
    if (!setupComplete) {
      setShowShortcutSetup(true);
    }
  }, []);

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

  const handleShortcutSetupComplete = () => {
    setShowShortcutSetup(false);
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
          <div className="flex items-center gap-4">
            {step !== "capture" && (
              <button
                onClick={handleReset}
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                New Capture
              </button>
            )}
            <button
              onClick={() => navigate("/settings")}
              className="text-accent hover:text-accent/80 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {showShortcutSetup ? (
            <ShortcutSetup onComplete={handleShortcutSetupComplete} />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
