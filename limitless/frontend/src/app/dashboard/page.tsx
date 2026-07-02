"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Users, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { ROUTES } from "@/config/routes";
import { AddMessageDialog } from "@/components/messages/AddMessageDialog";
import { cn } from "@/utils/cn";

export default function DashboardPage() {
  const { workspaceName, totalMessages, teamMembers, isLoading } = useDashboard();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-10">

        {/* Workspace hero */}
        <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-7">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-7 w-64 animate-pulse rounded bg-neutral-100" />
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Workspace
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-950 break-words">
                {workspaceName}
              </h2>
            </>
          )}
        </div>

        {/* Stats */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            At a glance
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  icon={<MessageSquare className="h-5 w-5" />}
                  label="Total Messages"
                  value={totalMessages}
                />
                <StatCard
                  icon={<Users className="h-5 w-5" />}
                  label="Team Members"
                  value={teamMembers}
                />
              </>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-neutral-950">{value}</p>
      </div>
    </div>
  );
}
