"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/constants";
import { messageService } from "@/services/message.service";
import { useAuth } from "@/hooks/useAuth";

export function useDashboard() {
  const { user, loading } = useAuth();

  const messagesQuery = useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => messageService.getMessages(),
    enabled: !loading && !!user,
  });

  const messages = messagesQuery.data ?? [];
  const uniqueUsers = new Set(messages.map((m) => m.user_id)).size;

  return {
    workspaceName: user?.displayName ? `${user.displayName}'s Workspace` : "My Workspace",
    loggedInUser: user?.displayName ?? user?.email ?? "—",
    totalMessages: messages.length,
    teamMembers: uniqueUsers,
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
  };
}
