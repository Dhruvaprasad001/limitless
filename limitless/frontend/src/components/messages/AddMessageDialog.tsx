"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageCreateSchema, type MessageCreateFormValues } from "@/schemas/message.schema";
import { useCreateMessage } from "@/hooks/useMessages";
import { cn } from "@/utils/cn";

interface AddMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMessageDialog({ open, onOpenChange }: AddMessageDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageCreateFormValues>({
    resolver: zodResolver(messageCreateSchema),
  });

  const createMessage = useCreateMessage();

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  async function onSubmit(values: MessageCreateFormValues) {
    await createMessage.mutateAsync(values);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Add Update</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Share what&apos;s happening with your team.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-slate-700"
            >
              Message
            </label>
            <textarea
              id="content"
              rows={4}
              placeholder="What's the update?"
              className={cn(
                "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm",
                "placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                errors.content && "border-red-400 focus:border-red-500 focus:ring-red-500"
              )}
              {...register("content")}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMessage.isPending}
              className={cn(
                "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm",
                "hover:bg-indigo-700 transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {isSubmitting || createMessage.isPending ? "Posting…" : "Post Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
