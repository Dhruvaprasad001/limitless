"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Users, Plus, Sparkles, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { MessageCard } from "@/components/messages/MessageCard";
import { useDashboard } from "@/hooks/useDashboard";
import { ROUTES } from "@/config/routes";
import { AddMessageDialog } from "@/components/messages/AddMessageDialog";
import { cn } from "@/utils/cn";

export default function DashboardPage() {
  const { workspaceName, totalMessages, teamMembers, recentMessages, isLoading } = useDashboard();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-10">

        {/* Workspace hero + Quick actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-neutral-200 bg-white px-8 py-7">
          <div>
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
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-neutral-950 wrap-break-word">
                  {workspaceName}
                </h2>
              </>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
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

        {/* Recent updates */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Recent Updates
            </h3>
            <button
              onClick={() => router.push(ROUTES.messages)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="flex gap-3">
                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-neutral-100" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2.5 w-24 animate-pulse rounded bg-neutral-100" />
                      <div className="h-2.5 w-full animate-pulse rounded bg-neutral-100" />
                      <div className="h-2.5 w-3/4 animate-pulse rounded bg-neutral-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-neutral-300" />
              <p className="mt-3 text-sm font-medium text-neutral-500">No updates yet</p>
              <p className="mt-1 text-xs text-neutral-400">Post your first team update to get started.</p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-4 rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Add Update
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <MessageCard key={msg.id} message={msg} />
              ))}
            </div>
          )}
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
