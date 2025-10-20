import { useState, useEffect } from "react";
import { VoiceCapture } from "@/components/VoiceCapture";
import { QuestionFlow } from "@/components/QuestionFlow";
import { MarkdownOutput } from "@/components/MarkdownOutput";
import { Celebration } from "@/components/Celebration";
import { ShortcutSetup } from "@/components/ShortcutSetup";
import { Anchor, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { CaptureData } from "@/types/capture";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    
    // Check if user has preferences set
    const checkPreferences = async () => {
      const { data } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (!data) {
        setShowShortcutSetup(true);
      }
    };
    
    checkPreferences();
  }, [user]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-ocean-mid to-ocean-bright flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <button
              onClick={handleLogout}
              className="text-accent hover:text-accent/80 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {showShortcutSetup ? (
            <ShortcutSetup onComplete={handleShortcutSetupComplete} userId={user?.id} />
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
                  userId={user?.id}
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
