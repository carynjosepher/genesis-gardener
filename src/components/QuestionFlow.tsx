import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, X } from "lucide-react";
import type { CaptureData } from "@/types/capture";

interface QuestionFlowProps {
  initialTranscript: string;
  onComplete: (data: CaptureData) => void;
}

const questions = [
  {
    id: "what",
    title: "What happened?",
    placeholder: "Describe what you want to remember...",
  },
  {
    id: "why",
    title: "Why Log This?",
    placeholder: "Why is this important or interesting?",
  },
  {
    id: "when",
    title: "When should you revisit this?",
    placeholder: "e.g., Next week, In 3 months, Never",
  },
  {
    id: "tags",
    title: "Add tags (optional)",
    placeholder: "Press Enter to add tags",
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

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete({
        what: answers.what,
        why: answers.why,
        when: answers.when,
        tags,
      });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const canProceed =
    question.id === "tags" ||
    (question.id !== "tags" && answers[question.id]?.trim().length > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-ocean-light">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
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
              onChange={(e) => setTagInput(e.target.value)}
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
