"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AskInput } from "@/components/ask/AskInput";
import { AnswerCard } from "@/components/ask/AnswerCard";
import { EvidenceCard } from "@/components/ask/EvidenceCard";
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

  const hasEvidence = result && result.supporting_message_ids.length > 0;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-neutral-950 tracking-tight">Ask AI</h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Ask questions about your team&apos;s updates. Answers are grounded in real messages.
          </p>
        </div>

        {/* Input */}
        <AskInput onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Conversation */}
        {question && (
          <div className="flex flex-col gap-4">
            {/* User bubble */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-neutral-950 px-4 py-2.5 text-sm text-white">
                {question}
              </div>
            </div>

            {/* AI response area */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-full max-w-[90%] rounded-2xl rounded-tl-sm border border-neutral-200 bg-white p-4">
                  <LoadingSkeleton lines={4} />
                </div>
              </div>
            )}

            {error && !isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error.message ?? "Failed to get an answer. Please try again."}
                </div>
              </div>
            )}

            {result && !isLoading && (
              <div className="flex flex-col gap-3">
                {/* AI answer bubble */}
                <div className="flex justify-start">
                  <div className="flex w-full max-w-[90%] flex-col gap-3">
                    <AnswerCard answer={result.answer} />
                  </div>
                </div>

                {/* Citations */}
                {hasEvidence && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-neutral-400 tracking-wide">
                      Sources ({result.supporting_message_ids.length})
                    </p>
                    {result.supporting_message_ids.map((id, i) => (
                      <EvidenceCard
                        key={id}
                        userName={result.supporting_user_names[i] ?? "Unknown"}
                        timestamp={result.supporting_timestamps[i] ?? new Date().toISOString()}
                        message={result.supporting_messages[i] ?? ""}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
