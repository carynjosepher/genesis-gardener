import { Anchor } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 rounded-lg p-2">
              <Anchor className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="font-bold text-lg">Chaos Captain</div>
              <div className="text-sm text-muted-foreground">Your light iOS companion</div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Built with care for those who capture the chaos
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Privacy-first • No data storage • Coming soon to iOS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
