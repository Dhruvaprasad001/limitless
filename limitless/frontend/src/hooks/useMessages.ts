"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { QUERY_KEYS, DEFAULT_MESSAGES_LIMIT } from "@/config/constants";
import { messageService } from "@/services/message.service";
import { useAuth } from "@/hooks/useAuth";
import type { MessageCreate, MessageResponse } from "@/types/message";

export function useMessages() {
  const { user, loading } = useAuth();
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.messages,
    queryFn: ({ pageParam = 1 }) =>
      messageService.getMessages(DEFAULT_MESSAGES_LIMIT, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === DEFAULT_MESSAGES_LIMIT ? allPages.length + 1 : undefined,
    enabled: !loading && !!user,
  });
}

export function useCreateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MessageCreate) => messageService.createMessage(data),
    onMutate: async (newMessage) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.messages });
      const previous = qc.getQueryData<InfiniteData<MessageResponse[]>>(QUERY_KEYS.messages);
      qc.setQueryData<InfiniteData<MessageResponse[]>>(QUERY_KEYS.messages, (old) => {
        if (!old) return old;
        const optimistic: MessageResponse = {
          id: `optimistic-${Date.now()}`,
          tenant_id: "",
          user_id: "",
          content: newMessage.content,
          event_time: newMessage.event_time ?? new Date().toISOString(),
          ingested_at: new Date().toISOString(),
        };
        return {
          ...old,
          pages: [[optimistic, ...old.pages[0]], ...old.pages.slice(1)],
        };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(QUERY_KEYS.messages, ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.messages });
    },
  });
}
