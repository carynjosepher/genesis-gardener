import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Copy, Check, Book, Share2, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CaptureData } from "@/types/capture";
import { addToAppleNotes } from "@/lib/notes";
interface MarkdownOutputProps {
  captureData: CaptureData;
  onComplete: () => void;
  userId?: string;
}
export const MarkdownOutput = ({
  captureData,
  onComplete,
  userId
}: MarkdownOutputProps) => {
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isSendingToNotion, setIsSendingToNotion] = useState(false);
  const [userPreference, setUserPreference] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const md = generateMarkdown(); // Get the markdown immediately
    checkNotionConnection();
    
    // Load user preference and auto-save
    const autoSave = async () => {
      if (!userId) return;
      
      // Get user's storage preference
      const { data } = await supabase
        .from("user_preferences")
        .select("storage_service")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (data?.storage_service) {
        setUserPreference(data.storage_service);
        
        // Auto-create calendar event if date is set
        if (captureData.when && captureData.when !== "I'll find it when I need it") {
          handleAddToCalendar();
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Auto-save based on preference
        if (data.storage_service === "apple_notes") {
          addToAppleNotes(md); // Use the markdown directly instead of state
          toast({
            title: "✓ Opening Apple Notes",
            description: "Your note is being added to Apple Notes",
            duration: 3000,
          });
        } else if (data.storage_service === "notion") {
          await handleSendToNotion();
        }
        
        // Auto-complete after a delay
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    };
    
    autoSave();
  }, [captureData, userId]);

  const checkNotionConnection = () => {
    const apiKey = localStorage.getItem("notion_api_key");
    const databaseId = localStorage.getItem("notion_database_id");
    setIsNotionConnected(!!apiKey && !!databaseId);
  };
  const generateMarkdown = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    
    let md = `${captureData.what.split("\n")[0] || "Note"}\n\n`;
    md += `${captureData.what}\n\n`;
    md += `${captureData.why}\n\n`;
    
    if (captureData.tags.length > 0) {
      md += captureData.tags.map(tag => `#${tag}`).join(" ");
      md += "\n\n";
    }
    
    if (captureData.when) {
      md += `Reminder: ${captureData.when}\n\n`;
    }
    
    md += `Captured on ${dateStr}`;
    setMarkdown(md);
    return md; // Return the markdown so it can be used immediately
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

  const handleSendToNotion = async () => {
    setIsSendingToNotion(true);
    try {
      const apiKey = localStorage.getItem("notion_api_key");
      const databaseId = localStorage.getItem("notion_database_id");

      const { error } = await supabase.functions.invoke("send-to-notion", {
        body: {
          apiKey,
          databaseId,
          title: captureData.what.split("\n")[0] || "Note",
          content: markdown,
          tags: captureData.tags,
        },
      });

      if (error) throw error;

      toast({
        title: "Sent to Notion!",
        description: "Your note has been added to your Notion database",
      });
      
      // Complete the flow after successful send
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      console.error("Notion error:", error);
      toast({
        title: "Failed to send",
        description: "Could not send note to Notion. Check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSendingToNotion(false);
    }
  };

  const handleSendToAppleNotes = () => {
    addToAppleNotes(markdown);
    
    toast({
      title: "✓ Opening Apple Notes",
      description: "Your note is being added to Apple Notes",
      duration: 3000,
    });
  };

  const convertToDate = (whenString: string): Date => {
    const now = new Date();
    
    switch (whenString) {
      case "Tomorrow":
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;
        
      case "Next week":
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(9, 0, 0, 0);
        return nextWeek;
        
      case "Next month":
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setHours(9, 0, 0, 0);
        return nextMonth;
        
      default:
        // If it's a custom date, try to parse it
        const parsed = new Date(whenString);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
        // Fallback to tomorrow if parsing fails
        const fallback = new Date(now);
        fallback.setDate(fallback.getDate() + 1);
        fallback.setHours(9, 0, 0, 0);
        return fallback;
    }
  };

  const handleAddToCalendar = () => {
    try {
      const title = captureData.what.split("\n")[0] || "Chaos Captain Event";
      const description = `${captureData.what}\\n\\n${captureData.why}\\n\\nTags: ${captureData.tags.join(", ")}`;
      
      // Convert the when string to an actual date
      const eventDate = convertToDate(captureData.when);
      
      // Create end date (1 hour after start)
      const endDate = new Date(eventDate);
      endDate.setHours(endDate.getHours() + 1);
      
      // Format dates for iCal (yyyyMMddTHHmmssZ)
      const formatICalDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const startDateStr = formatICalDate(eventDate);
      const endDateStr = formatICalDate(endDate);
      const nowStr = formatICalDate(new Date());
      
      // Create iCal format (.ics file)
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Chaos Captain//EN',
        'BEGIN:VEVENT',
        `UID:${nowStr}@chaoscaptain.app`,
        `DTSTAMP:${nowStr}`,
        `DTSTART:${startDateStr}`,
        `DTEND:${endDateStr}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      
      // Create blob and download
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chaos-captain-event.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Calendar File Created!",
        description: "Tap the file to add to your calendar",
      });
    } catch (error) {
      console.error("Calendar error:", error);
      toast({
        title: "Error",
        description: "Could not create calendar event",
        variant: "destructive",
      });
    }
  };
  return <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Note Complete!</h2>
        <p className="text-ocean-light">
          Ready to save to your notes
        </p>
      </div>

      {/* Note Preview - Apple Notes Style */}
      <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)] min-h-[300px]">
        <div className="space-y-4">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            {captureData.what.split("\n")[0] || "Note"}
          </h1>
          
          {/* Body */}
          <div className="text-gray-800 space-y-3">
            <p className="whitespace-pre-wrap">{captureData.what}</p>
            <p className="whitespace-pre-wrap">{captureData.why}</p>
          </div>
          
          {/* Tags */}
          {captureData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {captureData.tags.map((tag, index) => (
                <span key={index} className="text-blue-600 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Reminder */}
          {captureData.when && (
            <div className="text-sm text-gray-600 pt-2">
              <span className="font-medium">Reminder:</span> {captureData.when}
            </div>
          )}
          
          {/* Captured Date */}
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
            Captured on {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit"
            })}
          </div>
        </div>
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
        {captureData.when && captureData.when !== "I'll find it when I need it" && (
          <Button 
            onClick={handleAddToCalendar} 
            variant="outline" 
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        )}
        <Button 
          onClick={handleSendToAppleNotes} 
          variant="outline" 
          className="border-white/20 bg-white/10 text-white hover:bg-white/20"
        >
          <Book className="w-4 h-4 mr-2" />
          Apple Notes
        </Button>
        {isNotionConnected && (
          <Button 
            onClick={handleSendToNotion}
            disabled={isSendingToNotion}
            variant="outline" 
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isSendingToNotion ? "Sending..." : "Send to Notion"}
          </Button>
        )}
      </div>
      
      {/* Done Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={onComplete}
          className="bg-white/20 text-white hover:bg-white/30"
        >
          Done
        </Button>
      </div>
    </div>;
};