"use client";

import { getCurrentUser } from "@/lib/get-current-user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SeatGrid from "@/components/SeatGrid";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userId: string } | null>(null);

  useEffect(() => {
    const decoded = getCurrentUser();
    if (!decoded) {
      router.push("/login");
    } else {
      setUser(decoded);
    }
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      {user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to your dashboard</h1>
          <p className="text-muted-foreground mt-2">User ID: {user.userId}</p>
          <SeatGrid />
        </div>
      ) : (
        <p className="text-center">Checking authentication...</p>
      )}
    </div>
  );
}
