"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AskInput } from "@/components/ask/AskInput";
import { AnswerCard } from "@/components/ask/AnswerCard";
import { EvidenceCard } from "@/components/ask/EvidenceCard";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { useAskAI } from "@/hooks/useAskAI";

export default function AskPage() {
  const { ask, result, isLoading, error, reset } = useAskAI();
  const [question, setQuestion] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleSubmit(q: string) {
    setQuestion(q);
    reset();
    ask({ question: q });
  }

  // Scroll to bottom whenever new content appears
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [question, result, isLoading]);

  const hasEvidence = result && result.supporting_message_ids.length > 0;

  return (
    <AppShell>
      <div className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 pb-4">
          <h2 className="text-base font-semibold text-neutral-950 tracking-tight">Ask AI</h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Ask questions about your team&apos;s updates. Answers are grounded in real messages.
          </p>
        </div>

        {/* Scrollable conversation */}
        <div className="flex-1 overflow-y-auto">
          {!question && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-neutral-400">Ask anything to get started.</p>
            </div>
          )}

          {question && (
            <div className="flex flex-col gap-4 pb-4">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-neutral-950 px-4 py-2.5 text-sm text-white">
                  {question}
                </div>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-full max-w-[90%] rounded-2xl rounded-tl-sm border border-neutral-200 bg-white p-4">
                    <LoadingSkeleton lines={4} />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && !isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error.message ?? "Failed to get an answer. Please try again."}
                  </div>
                </div>
              )}

              {/* Answer + citations */}
              {result && !isLoading && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-start">
                    <div className="w-full max-w-[90%]">
                      <AnswerCard answer={result.answer} />
                    </div>
                  </div>

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

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input pinned to bottom */}
        <div className="shrink-0 pt-3">
          <AskInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </AppShell>
  );
}
