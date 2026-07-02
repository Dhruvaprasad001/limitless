"use client";

import { useMutation } from "@tanstack/react-query";
import { queryService } from "@/services/query.service";
import type { QueryResponse } from "../../client";

export function useAskAI() {
  const mutation = useMutation<QueryResponse, Error, string>({
    mutationFn: (question) => queryService.askQuestion(question),
  });

  return {
    ask: mutation.mutate,
    askAsync: mutation.mutateAsync,
    result: mutation.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
