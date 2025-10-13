import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Book, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortcutSetupProps {
  onComplete: () => void;
}

export const ShortcutSetup = ({ onComplete }: ShortcutSetupProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleInstallShortcut = () => {
    // Open the iCloud Shortcut link to install "Chaos Captain to Notes"
    const shortcutUrl = "shortcuts://run-shortcut?name=Chaos%20Captain%20to%20Notes&input=This%20is%20a%20test";
    
    window.location.href = shortcutUrl;
    
    toast({
      title: "Opening Shortcut",
      description: "Install the Chaos Captain to Notes shortcut",
    });
    
    setStep(2);
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
        <h2 className="text-3xl font-bold text-white">Save to Apple Notes</h2>
        <p className="text-ocean-light">
          Set up a shortcut to automatically save your notes to the Notes app
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 space-y-6">
        {step === 1 && (
          <>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  1
                </div>
                <div className="text-white">
                  <p className="font-medium">Open Shortcuts App</p>
                  <p className="text-sm text-ocean-light mt-1">
                    Tap below to open Shortcuts app, then follow the simple setup steps
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  2
                </div>
                <div className="text-white">
                  <p className="font-medium">Create the Shortcut</p>
                  <p className="text-sm text-ocean-light mt-1">
                    Follow the step-by-step instructions to create your "Save to Notes" shortcut
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  3
                </div>
                <div className="text-white">
                  <p className="font-medium">Start Capturing</p>
                  <p className="text-sm text-ocean-light mt-1">
                    Your notes will automatically save to the Notes app with one tap
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleInstallShortcut}
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Book className="w-5 h-5 mr-2" />
                Connect to Notes
              </Button>
              
              <button
                onClick={handleSkip}
                className="w-full text-sm text-ocean-light hover:text-white transition-colors"
              >
                Skip for now
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="text-white">
                <p className="font-medium text-lg">Create Your Shortcut</p>
                <p className="text-sm text-ocean-light mt-2">
                  Follow these steps in the Shortcuts app to enable Notes integration
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 text-left space-y-3">
                <p className="text-sm font-medium text-white">Quick Setup Steps:</p>
                <ol className="text-xs text-ocean-light space-y-2 list-decimal list-inside">
                  <li>In Shortcuts app, tap "+" to create new shortcut</li>
                  <li>Search and add "Receive" action, set to receive "Text"</li>
                  <li>Search and add "Create Note" action</li>
                  <li>In Create Note, tap the note field and select "Shortcut Input"</li>
                  <li>Tap the shortcut name at top, rename to "Save to Notes"</li>
                  <li>Tap the info icon (i), enable "Show in Share Sheet"</li>
                  <li>Under Share Sheet Types, enable "Text"</li>
                  <li>Done! Return to Chaos Captain</li>
                </ol>
                
                <div className="mt-3 p-3 bg-accent/10 rounded border border-accent/20">
                  <p className="text-xs text-accent font-medium mb-1">⚡ Pro Tip:</p>
                  <p className="text-xs text-ocean-light">
                    This shortcut will appear in the Share menu when you tap "Apple Notes" button in Chaos Captain. It only takes 2 minutes to set up once!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleComplete}
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Check className="w-5 h-5 mr-2" />
                Done - Start Using App
              </Button>
              
              <button
                onClick={handleSkip}
                className="w-full text-sm text-ocean-light hover:text-white transition-colors"
              >
                Skip for now
              </button>
            </div>
          </>
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
