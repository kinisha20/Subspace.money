import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminView } from "@/components/dashboard/AdminView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "System overview, user metrics, and platform health.",
};

export default function AdminPage() {
  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and health metrics">
      <AdminView />
    </DashboardLayout>
  );
}
