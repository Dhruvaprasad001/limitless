"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/constants";
import { messageService } from "@/services/message.service";
import { userService } from "@/services/user.service";
import { tenantService } from "@/services/tenant.service";
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

  const tenantQuery = useQuery({
    queryKey: QUERY_KEYS.tenant,
    queryFn: () => tenantService.getMyTenant(),
    enabled: !loading && !!user,
  });

  const messages = messagesQuery.data ?? [];
  const teamMembers = usersQuery.data?.length ?? 0;
  const workspaceName = tenantQuery.data?.name ?? user?.displayName ?? "My Workspace";

  return {
    workspaceName,
    totalMessages: messages.length,
    teamMembers,
    isLoading: messagesQuery.isLoading || usersQuery.isLoading || tenantQuery.isLoading,
    error: messagesQuery.error ?? usersQuery.error ?? tenantQuery.error,
  };
}
