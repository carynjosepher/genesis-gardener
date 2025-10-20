import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { openConnectToNotes } from "@/lib/notes";

interface ShortcutSetupProps {
  onComplete: () => void;
  userId?: string;
}

export const ShortcutSetup = ({ onComplete, userId }: ShortcutSetupProps) => {
  const [connectedService, setConnectedService] = useState<"notes" | "notion" | null>(null);
  const { toast } = useToast();

  const handleConnectNotes = async () => {
    // Open iCloud link to install the shortcut
    openConnectToNotes();
    
    // Mark as connected and save to database
    setConnectedService("notes");
    
    if (userId) {
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        storage_service: "apple_notes",
      });
    }
    
    toast({
      title: "Installing Shortcut",
      description: "After installation, use the back button to return to Chaos Captain",
      duration: 5000,
    });
  };

  const handleConnectNotion = async () => {
    // Placeholder URL - will be updated when Notion shortcut is ready
    const shortcutUrl = "https://www.icloud.com/shortcuts/notion-placeholder";
    window.open(shortcutUrl, '_blank');
    
    // Mark as connected and save to database
    setConnectedService("notion");
    
    if (userId) {
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        storage_service: "notion",
      });
    }
    
    toast({
      title: "Opening Shortcut",
      description: "Install the Chaos Captain to Notion shortcut in a new tab",
    });
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleSkip = () => {
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
