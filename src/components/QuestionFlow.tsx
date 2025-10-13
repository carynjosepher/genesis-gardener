import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowRight, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { CaptureData } from "@/types/capture";

interface QuestionFlowProps {
  initialTranscript: string;
  onComplete: (data: CaptureData) => void;
}

const questions = [
  {
    id: "why",
    title: "Note Title",
    placeholder: "Enter a title for your note",
  },
  {
    id: "tags",
    title: "Add Tags",
    placeholder: "Type tags separated by spaces and press Enter",
  },
  {
    id: "when",
    title: "Set Reminder",
    placeholder: "e.g., Tomorrow, Next week, In 3 months, or leave empty for no reminder",
  },
];

export const QuestionFlow = ({ initialTranscript, onComplete }: QuestionFlowProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    what: initialTranscript,
    why: "",
    when: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedReminder, setSelectedReminder] = useState<string>("");
  const [customDate, setCustomDate] = useState<Date>();

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const reminderValue = selectedReminder === "Custom" && customDate
        ? format(customDate, "PPP")
        : selectedReminder;
      
      onComplete({
        what: answers.what,
        why: answers.why,
        when: reminderValue,
        tags,
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const words = value.split(/\s+/);
    const formattedWords = words.map(word => {
      if (!word) return '';
      const cleanWord = word.replace(/^#+/, '');
      return cleanWord ? `#${cleanWord}` : '';
    });
    setTagInput(formattedWords.join(' '));
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const words = tagInput.trim().split(/\s+/);
      const newTags = words.map(word => {
        const cleanWord = word.replace(/^#+/, '');
        return cleanWord ? `#${cleanWord}` : '';
      }).filter(tag => tag && !tags.includes(tag));
      
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleReminderSelect = (option: string) => {
    setSelectedReminder(option);
    if (option !== "Custom") {
      setCustomDate(undefined);
    }
  };

  const canProceed =
    question.id === "tags" ||
    (question.id === "when" && (selectedReminder === "I'll find it when I need it" || (selectedReminder === "Custom" ? !!customDate : !!selectedReminder))) ||
    (question.id !== "tags" && question.id !== "when" && answers[question.id]?.trim().length > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-ocean-light">
          <span>step {currentQuestion + 2} of {questions.length + 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-[var(--shadow-card)]">
        <h2 className="text-3xl font-bold text-white mb-6">{question.title}</h2>

        {question.id === "tags" ? (
          <div className="space-y-4">
            <Input
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagAdd}
              placeholder={question.placeholder}
              className="bg-white/10 border-white/20 text-white placeholder:text-ocean-light"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="pl-3 pr-2 py-1 text-sm bg-accent/20 text-accent border-accent/30"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 hover:text-accent/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : question.id === "when" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {["Tomorrow", "Next Week", "Next Month", "I'll find it when I need it"].map((option) => (
                <Button
                  key={option}
                  onClick={() => handleReminderSelect(option)}
                  variant={selectedReminder === option ? "hero" : "outline"}
                  className={cn(
                    "h-auto py-4 px-6 text-left justify-start",
                    selectedReminder === option
                      ? ""
                      : "border-white/20 text-white hover:bg-white/10"
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={selectedReminder === "Custom" ? "hero" : "outline"}
                  className={cn(
                    "w-full h-auto py-4 px-6 justify-start text-left font-normal",
                    selectedReminder === "Custom"
                      ? ""
                      : "border-white/20 text-white hover:bg-white/10",
                    !customDate && selectedReminder === "Custom" && "text-ocean-light"
                  )}
                  onClick={() => setSelectedReminder("Custom")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDate ? format(customDate, "PPP") : "Custom Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={setCustomDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Textarea
            value={answers[question.id]}
            onChange={(e) =>
              setAnswers({ ...answers, [question.id]: e.target.value })
            }
            placeholder={question.placeholder}
            className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-ocean-light resize-none text-lg"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          variant="hero"
          className="flex items-center gap-2"
        >
          {currentQuestion === questions.length - 1 ? "Generate Note" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
