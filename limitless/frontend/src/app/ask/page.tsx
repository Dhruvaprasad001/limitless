"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AskInput } from "@/components/ask/AskInput";
import { AnswerCard } from "@/components/ask/AnswerCard";
import { EvidenceCard } from "@/components/ask/EvidenceCard";
import { ExplainabilityPanel } from "@/components/ask/ExplainabilityPanel";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useAskAI } from "@/hooks/useAskAI";

export default function AskPage() {
  const { ask, result, isLoading, error, reset } = useAskAI();
  const [question, setQuestion] = useState("");

  function handleSubmit(q: string) {
    setQuestion(q);
    reset();
    ask({ question: q });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ask AI</h2>
          <p className="text-sm text-slate-500">
            Ask questions about your team&apos;s updates. Answers are grounded in real messages.
          </p>
        </div>

        <AskInput onSubmit={handleSubmit} isLoading={isLoading} />

        {question && (
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium">You asked: </span>
            {question}
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
              <LoadingSkeleton lines={4} />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error.message ?? "Failed to get an answer. Please try again."}
          </p>
        )}

        {result && !isLoading && (
          <div className="space-y-4">
            <AnswerCard answer={result.answer} />

            {result.supporting_message_ids.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Supporting Evidence ({result.supporting_message_ids.length})
                </p>
                <div className="space-y-2">
                  {result.supporting_message_ids.map((id, i) => (
                    <EvidenceCard
                      key={id}
                      messageId={id}
                      timestamp={result.supporting_timestamps[i] ?? new Date().toISOString()}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            <ExplainabilityPanel
              queryPlan={result.query_plan}
              citedCount={result.supporting_message_ids.length}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
