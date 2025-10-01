import { Shield, Zap, Link2 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy-First Design",
    description: "Zero data storage. Your notes pass through instantly to your chosen destination. We never keep your content.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Say 'Hey Siri, let me talk to the Captain' and boom—you're capturing. No app switching, no friction, just flow.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Link2,
    title: "Works Where You Work",
    description: "Apple Notes by default. Notion and Evernote as options. Or send to any email inbox. Your workflow, your rules.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for real life
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No complex setup. No learning curve. Just capture and go.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border hover:border-accent/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
