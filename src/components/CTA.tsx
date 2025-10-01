import { Button } from "@/components/ui/button";
import { Anchor } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-[var(--wave-gradient)]" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-full p-4 border border-primary-foreground/20">
            <Anchor className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
          Ready to tame the chaos?
        </h2>
        
        <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
          Chaos Captain launches soon on iOS. Be among the first to experience the easiest way to capture your thoughts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="secondary" 
            size="xl" 
            className="min-w-[220px] bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Join the Waitlist
          </Button>
          <Button 
            variant="outline" 
            size="xl" 
            className="min-w-[220px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            View on GitHub
          </Button>
        </div>

        <div className="mt-12 text-primary-foreground/70">
          <p className="text-sm">
            "Let me talk to the Captain" • "Send a note to the Captain" • "Start Chaos Captain"
          </p>
        </div>
      </div>
    </section>
  );
};
