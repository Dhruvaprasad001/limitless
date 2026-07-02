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
import type { MessageCreate, MessageListResponse, MessageResponse } from "@/types/message";

export function useMessages() {
  const { user, loading } = useAuth();
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.messages,
    queryFn: ({ pageParam = 1 }) =>
      messageService.getMessages(DEFAULT_MESSAGES_LIMIT, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return fetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    enabled: !loading && !!user,
  });
}

export function useCreateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MessageCreate) => messageService.createMessage(data),
    onMutate: async (newMessage) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.messages });
      const previous = qc.getQueryData<InfiniteData<MessageListResponse>>(QUERY_KEYS.messages);
      qc.setQueryData<InfiniteData<MessageListResponse>>(QUERY_KEYS.messages, (old) => {
        if (!old) return old;
        const optimistic: MessageResponse = {
          id: `optimistic-${Date.now()}`,
          tenant_id: "",
          user_id: "",
          content: newMessage.content,
          event_time: newMessage.event_time ?? new Date().toISOString(),
          ingested_at: new Date().toISOString(),
        };
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [
            { ...firstPage, total: firstPage.total + 1, items: [optimistic, ...firstPage.items] },
            ...rest,
          ],
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
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
    },
  });
}
