import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Suspense } from "react";

async function ShellWithAuth({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userEmail = (data.claims.email as string) || undefined;

  return <DashboardShell userEmail={userEmail}>{children}</DashboardShell>;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShellWithAuth>{children}</ShellWithAuth>
    </Suspense>
  );
}
