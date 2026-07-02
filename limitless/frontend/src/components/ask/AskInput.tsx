"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryRequestSchema, type QueryRequestFormValues } from "@/schemas/query.schema";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";

interface AskInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export function AskInput({ onSubmit, isLoading }: AskInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QueryRequestFormValues>({
    resolver: zodResolver(queryRequestSchema),
  });

  const { ref: registerRef, ...registerRest } = register("question");

  function onValid(values: QueryRequestFormValues) {
    onSubmit(values.question);
    reset();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onValid)();
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="w-full">
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-4 py-3 transition-colors",
          "focus-within:border-neutral-950 focus-within:ring-1 focus-within:ring-neutral-950",
          errors.question && "border-red-400 focus-within:border-red-500 focus-within:ring-red-500"
        )}
      >
        <textarea
          rows={1}
          placeholder="Ask anything about your team's updates…"
          className="max-h-40 flex-1 resize-none overflow-auto bg-transparent text-sm text-neutral-950 placeholder-neutral-400 outline-none"
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          ref={(el) => {
            registerRef(el);
            (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
          }}
          {...registerRest}
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Ask"
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white",
            "hover:bg-neutral-800 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          {isLoading ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <ArrowUp className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      {errors.question && (
        <p className="mt-1.5 text-xs text-red-600">{errors.question.message}</p>
      )}
      <p className="mt-1.5 text-xs text-neutral-400">Press Enter to send · Shift+Enter for new line</p>
    </form>
  );
}
