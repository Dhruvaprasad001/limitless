"use client";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryRequestFormValues>({
    resolver: zodResolver(queryRequestSchema),
  });

  function onValid(values: QueryRequestFormValues) {
    onSubmit(values.question);
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="w-full">
      <div className="relative">
        <textarea
          rows={3}
          placeholder="Ask anything about your team's updates…"
          className={cn(
            "w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3.5 pr-16 text-sm text-neutral-950",
            "placeholder-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950 transition-colors",
            errors.question && "border-red-400 focus:border-red-500 focus:ring-red-500"
          )}
          {...register("question")}
        />
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Ask"
          className={cn(
            "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white",
            "hover:bg-neutral-800 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
      {errors.question && (
        <p className="mt-1.5 text-xs text-red-600">{errors.question.message}</p>
      )}
    </form>
  );
}
