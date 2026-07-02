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
      <div className="space-y-8">
        <div>
          <h2 className="text-base font-semibold text-neutral-950 tracking-tight">Overview</h2>
          <p className="mt-0.5 text-sm text-neutral-500">Your workspace at a glance.</p>
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
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setAddOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white",
                "hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              )}
            >
              <Plus className="h-4 w-4" />
              Add Update
            </button>
            <button
              onClick={() => router.push(ROUTES.ask)}
              className={cn(
                "flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700",
                "hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
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
