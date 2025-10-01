import { MessageSquare, Tag, Calendar, Sparkles } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "What's this about?",
    description: "Tell Siri or type what's on your mind. Quick dictation or a few words—your choice.",
  },
  {
    icon: Tag,
    title: "Quick category",
    description: "Tap Work, Personal, Errand, Idea, or add your own. Keep it organized effortlessly.",
  },
  {
    icon: Calendar,
    title: "When to revisit",
    description: "Tomorrow? Next week? Someday? Or schedule it precisely—Captain's got you covered.",
  },
  {
    icon: Sparkles,
    title: "Anchors aweigh!",
    description: "Your note sails straight to your destination with celebration confetti. Done and done.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Four steps. Zero friction.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chaos Captain guides you through a quick capture flow that feels like a friendly conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-ocean)] transition-all duration-300 hover:-translate-y-1 border border-border h-full">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-6 group-hover:bg-accent/20 transition-colors">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>
                
                <div className="text-sm font-semibold text-accent mb-2">
                  Step {index + 1}
                </div>
                
                <h3 className="text-xl font-bold mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-8 h-0.5 bg-gradient-to-r from-accent/50 to-accent/10 -translate-x-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
