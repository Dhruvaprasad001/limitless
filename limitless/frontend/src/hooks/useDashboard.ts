"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/constants";
import { messageService } from "@/services/message.service";
import { userService } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth";

export function useDashboard() {
  const { user, loading } = useAuth();

  const messagesQuery = useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: () => messageService.getMessages(),
    enabled: !loading && !!user,
  });

  const usersQuery = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => userService.getUsers(),
    enabled: !loading && !!user,
  });

  const messages = messagesQuery.data ?? [];
  const recentMessages = messages.slice(0, 5);

  return {
    workspaceName: user?.displayName ?? "My Workspace",
    totalMessages: messages.length,
    teamMembers: usersQuery.data?.length ?? 0,
    recentMessages,
    isLoading: messagesQuery.isLoading || usersQuery.isLoading,
    error: messagesQuery.error ?? usersQuery.error,
  };
}
