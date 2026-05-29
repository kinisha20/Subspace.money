import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your complete financial overview — balance, savings, subscriptions, and AI insights.",
};

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Good morning, Aryan"
      subtitle="Thursday, 29 May 2026"
    >
      <DashboardHome />
    </DashboardLayout>
  );
}
