"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { QueryPlan } from "@/types/query";
import { cn } from "@/utils/cn";

interface ExplainabilityPanelProps {
  queryPlan: QueryPlan;
  citedCount: number;
}

export function ExplainabilityPanel({ queryPlan, citedCount }: ExplainabilityPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const rows: { label: string; value: string }[] = [
    { label: "Tenant-isolated retrieval", value: "Yes" },
    { label: "Hybrid search (lexical + semantic)", value: "Yes" },
    { label: "Entity detected", value: queryPlan.entity ?? "none" },
    { label: "Time range filter", value: queryPlan.time_range ?? "none" },
    { label: "Confident plan", value: queryPlan.confident ? "Yes" : "No" },
    { label: "Messages cited", value: String(citedCount) },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          How this answer was generated
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3">
          <dl className="space-y-2">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd
                  className={cn(
                    "text-xs font-medium",
                    value === "Yes" || value === "High confidence"
                      ? "text-green-700"
                      : value === "No" || value === "none" || value === "Low confidence"
                      ? "text-slate-500"
                      : "text-slate-800"
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
