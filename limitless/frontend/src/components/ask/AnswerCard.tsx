interface AnswerCardProps {
  answer: string;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-950 text-xs text-white font-bold">
          AI
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Answer
        </span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">{answer}</p>
    </div>
  );
}
