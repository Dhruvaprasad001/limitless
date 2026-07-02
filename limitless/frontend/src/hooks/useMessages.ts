"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/constants";
import { messageService } from "@/services/message.service";
import { useAuth } from "@/hooks/useAuth";
import type { MessageCreate, MessageResponse } from "@/types/message";

export function useMessages() {
  const { user, loading } = useAuth();
  return useQuery({
    queryKey: QUERY_KEYS.messages,
    queryFn: () => messageService.getMessages(),
    enabled: !loading && !!user,
  });
}

export function useCreateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MessageCreate) => messageService.createMessage(data),
    onMutate: async (newMessage) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.messages });
      const previous = qc.getQueryData<MessageResponse[]>(QUERY_KEYS.messages);
      qc.setQueryData<MessageResponse[]>(QUERY_KEYS.messages, (old = []) => [
        {
          id: `optimistic-${Date.now()}`,
          tenant_id: "",
          user_id: "",
          content: newMessage.content,
          event_time: newMessage.event_time ?? new Date().toISOString(),
          ingested_at: new Date().toISOString(),
        },
        ...old,
      ]);
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
