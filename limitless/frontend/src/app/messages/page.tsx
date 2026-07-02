"use client";

import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MessageCard } from "@/components/messages/MessageCard";
import { AddMessageDialog } from "@/components/messages/AddMessageDialog";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useMessages } from "@/hooks/useMessages";
import { cn } from "@/utils/cn";

export default function MessagesPage() {
  const { data: messages, isLoading, error } = useMessages();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-950 tracking-tight">
              Team Updates
            </h2>
            <p className="mt-0.5 text-sm text-neutral-500">
              {messages ? `${messages.length} message${messages.length !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
                <LoadingSkeleton lines={3} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load messages. Please refresh.
          </p>
        )}

        {!isLoading && !error && messages?.length === 0 && (
          <EmptyState
            icon={<MessageSquare className="h-5 w-5" />}
            title="No updates yet"
            description="Post your first team update to get started."
            action={
              <button
                onClick={() => setAddOpen(true)}
                className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Add Update
              </button>
            }
          />
        )}

        {!isLoading && messages && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageCard key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Add update"
        className={cn(
          "fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full",
          "bg-neutral-950 text-white shadow-lg hover:bg-neutral-800 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        )}
      >
        <Plus className="h-5 w-5" />
      </button>

      <AddMessageDialog open={addOpen} onOpenChange={setAddOpen} />
    </AppShell>
  );
}
