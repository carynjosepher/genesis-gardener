import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Anchor, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  onReset: () => void;
}

export const Celebration = ({ onReset }: CelebrationProps) => {
  const [message] = useState(getRandomMessage());

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#00D9FF", "#0066FF", "#FFD700"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#00D9FF", "#0066FF", "#FFD700"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center animate-fade-in">
      <div className="relative">
        <Anchor className="w-24 h-24 text-accent animate-bounce" />
        <Sparkles className="w-8 h-8 text-accent absolute -top-2 -right-2 animate-pulse" />
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white">{message}</h2>
        <p className="text-xl text-ocean-light max-w-md mx-auto">
          Your chaos is captured. Your mind is clear. Your note is ready to work
          wherever you need it.
        </p>
      </div>

      <div className="space-y-4">
        <Button onClick={onReset} variant="hero" size="xl">
          Capture Another Note
        </Button>
        <p className="text-sm text-ocean-light">
          Ready to tame more chaos?
        </p>
      </div>
    </div>
  );
};

function getRandomMessage(): string {
  const messages = [
    "Chaos Tamed! 🎯",
    "Note Captured! ⚓",
    "Smooth Sailing! ⛵",
    "All Hands On Deck! 🌊",
    "Anchors Aweigh! ⚓",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
