import { Button } from "@/components/ui/button";
import heroShip from "@/assets/hero-ship.jpg";
import { Anchor } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
      
      {/* Hero image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroShip} 
          alt="Sailing ship on ocean" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6 animate-in fade-in duration-700">
          <div className="bg-accent/10 backdrop-blur-sm rounded-full p-4 border border-accent/20">
            <Anchor className="w-12 h-12 text-accent" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-100">
          Chaos Captain
        </h1>
        
        <p className="text-xl md:text-2xl mb-4 text-muted-foreground max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Your light iOS companion that turns chaos into clarity
        </p>
        
        <p className="text-lg md:text-xl mb-10 text-muted-foreground/80 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-300">
          Launch with Siri, answer a few smart questions, and watch your thoughts sail straight into Apple Notes, Notion, or wherever you work best.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button variant="hero" size="xl" className="min-w-[200px]">
            Coming to iOS Soon
          </Button>
          <Button variant="outline" size="xl" className="min-w-[200px]">
            Learn More
          </Button>
        </div>

        <div className="mt-16 text-sm text-muted-foreground/70 animate-in fade-in duration-700 delay-700">
          Privacy-first • No data storage • Works with your favorite apps
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-24 text-background fill-current">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};
