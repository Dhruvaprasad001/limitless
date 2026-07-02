"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/config/routes";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(ROUTES.dashboard);
    } else {
      router.replace(ROUTES.login);
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSkeleton lines={2} className="w-48" />
    </div>
  );
}
