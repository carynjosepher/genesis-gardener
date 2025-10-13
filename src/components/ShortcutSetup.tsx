import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortcutSetupProps {
  onComplete: () => void;
}

export const ShortcutSetup = ({ onComplete }: ShortcutSetupProps) => {
  const [connectedService, setConnectedService] = useState<"notes" | "notion" | null>(null);
  const { toast } = useToast();

  const handleConnectNotes = () => {
    const shortcutUrl = "shortcuts://run-shortcut?name=Chaos%20Captain%20to%20Notes&input=This%20is%20a%20test";
    window.location.href = shortcutUrl;
    
    toast({
      title: "Opening Shortcut",
      description: "Install the Chaos Captain to Notes shortcut",
    });
    
    // Mark as connected and store preference
    setConnectedService("notes");
    localStorage.setItem("connected_service", "notes");
  };

  const handleConnectNotion = () => {
    // Placeholder URL - will be updated when Notion shortcut is ready
    const shortcutUrl = "https://www.icloud.com/shortcuts/notion-placeholder";
    window.location.href = shortcutUrl;
    
    toast({
      title: "Opening Shortcut",
      description: "Install the Chaos Captain to Notion shortcut",
    });
    
    // Mark as connected and store preference
    setConnectedService("notion");
    localStorage.setItem("connected_service", "notion");
  };

  const handleComplete = () => {
    localStorage.setItem("shortcut_setup_complete", "true");
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("shortcut_setup_complete", "skipped");
    onComplete();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
            <Book className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Connect Chaos Captain to Your Notes App</h2>
        <p className="text-ocean-light max-w-md mx-auto">
          Choose where you want Chaos Captain to send your notes. You can link Apple Notes or Notion — your information always stays on your device or in your connected workspace.
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 space-y-4">
        {/* Apple Notes Connection */}
        <div className="space-y-3">
          {connectedService === "notes" ? (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">✅ Connected to Notes</span>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleConnectNotes}
              variant="hero"
              size="lg"
              className="w-full"
            >
              <Book className="w-5 h-5 mr-2" />
              Connect to Notes
            </Button>
          )}
        </div>

        {/* Notion Connection */}
        <div className="space-y-3">
          {connectedService === "notion" ? (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">✅ Connected to Notion</span>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleConnectNotion}
              variant="ocean"
              size="lg"
              className="w-full"
            >
              <FileText className="w-5 h-5 mr-2" />
              Connect to Notion
            </Button>
          )}
        </div>

        {/* Continue Button - shown after connection */}
        {connectedService && (
          <div className="pt-4">
            <Button
              onClick={handleComplete}
              variant="default"
              size="lg"
              className="w-full"
            >
              Continue to App
            </Button>
          </div>
        )}

        {/* Skip Option */}
        {!connectedService && (
          <button
            onClick={handleSkip}
            className="w-full text-sm text-ocean-light hover:text-white transition-colors pt-2"
          >
            Skip for now
          </button>
        )}
      </Card>

      <div className="text-center">
        <p className="text-xs text-ocean-light">
          You can always set this up later in Settings
        </p>
      </div>
    </div>
  );
};
