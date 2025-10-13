import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CaptureData } from "@/types/capture";
interface MarkdownOutputProps {
  captureData: CaptureData;
  onComplete: () => void;
}
export const MarkdownOutput = ({
  captureData,
  onComplete
}: MarkdownOutputProps) => {
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    generateMarkdown();
  }, [captureData]);
  const generateMarkdown = () => {
    const now = new Date();
    const timestamp = now.toISOString();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    let md = `# ${captureData.what.split("\n")[0] || "Note"}\n\n`;
    md += `**Captured:** ${dateStr}\n\n`;
    md += `## What\n\n${captureData.what}\n\n`;
    md += `## Why It Matters\n\n${captureData.why}\n\n`;
    md += `## When to Revisit\n\n${captureData.when}\n\n`;
    if (captureData.tags.length > 0) {
      md += `## Tags\n\n`;
      md += captureData.tags.map(tag => `\`${tag}\``).join(" · ");
      md += "\n\n";
    }
    md += `---\n\n`;
    md += `*Created with Chaos Captain* 🎯\n`;
    setMarkdown(md);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Markdown copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };
  const handleDownload = () => {
    const blob = new Blob([markdown], {
      type: "text/markdown"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chaos-captain-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Your note has been saved"
    });
  };
  const handleEmail = () => {
    const subject = encodeURIComponent("Chaos Captain Note");
    const body = encodeURIComponent(markdown);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  return <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Note Complete!</h2>
        <p className="text-ocean-light">
          Here's your beautifully formatted markdown note
        </p>
      </div>

      {/* Markdown Preview */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-[var(--shadow-card)]">
        <pre className="text-sm text-white font-mono whitespace-pre-wrap overflow-x-auto">
          {markdown}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={handleCopy} variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
          {copied ? <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </> : <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>}
        </Button>
        <Button onClick={handleDownload} variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button onClick={handleEmail} variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
      </div>

      <div className="text-center pt-4">
        <Button onClick={onComplete} variant="hero" size="lg">
          Complete 🎉
        </Button>
      </div>
    </div>;
};