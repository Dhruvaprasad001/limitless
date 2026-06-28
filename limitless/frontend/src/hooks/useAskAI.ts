"use client";

import { useMutation } from "@tanstack/react-query";
import { queryService } from "@/services/query.service";
import type { QueryRequest, QueryResponse } from "@/types/query";

export function useAskAI() {
  const mutation = useMutation<QueryResponse, Error, QueryRequest>({
    mutationFn: (data) => queryService.askQuestion(data),
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
