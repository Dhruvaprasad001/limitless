"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, User2, MessageSquare, Users, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { ROUTES } from "@/config/routes";
import { AddMessageDialog } from "@/components/messages/AddMessageDialog";
import { cn } from "@/utils/cn";

export default function DashboardPage() {
  const { workspaceName, loggedInUser, totalMessages, teamMembers, isLoading } =
    useDashboard();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  const stats = [
    { label: "Workspace", value: workspaceName, icon: <Building2 className="h-5 w-5" /> },
    { label: "Logged In As", value: loggedInUser, icon: <User2 className="h-5 w-5" /> },
    {
      label: "Total Messages",
      value: totalMessages,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    { label: "Team Members", value: teamMembers, icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <p className="text-sm text-slate-500">Your workspace at a glance.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : stats.map((s) => (
                <DashboardCard
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  icon={s.icon}
                />
              ))}
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm",
                "hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              )}
            >
              <Plus className="h-4 w-4" />
              Add Update
            </button>
            <button
              onClick={() => router.push(ROUTES.ask)}
              className={cn(
                "flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-medium text-indigo-700 shadow-sm",
                "hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </button>
          </div>
        </div>
      </div>

      <AddMessageDialog open={addOpen} onOpenChange={setAddOpen} />
    </AppShell>
  );
}
