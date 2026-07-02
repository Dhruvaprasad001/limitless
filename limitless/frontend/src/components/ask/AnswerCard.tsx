import { Sparkles } from "lucide-react";

interface AnswerCardProps {
  answer: string;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div className="rounded-2xl rounded-tl-sm border border-neutral-200 bg-white p-4">
      <div className="mb-2.5 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
        <span className="text-xs font-medium text-neutral-400">AI</span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">{answer}</p>
    </div>
  );
}
