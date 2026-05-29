import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationsView } from "@/components/dashboard/NotificationsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "All your financial alerts and smart nudges.",
};

export default function NotificationsPage() {
  return (
    <DashboardLayout title="Notifications" subtitle="Alerts, renewals, and smart nudges">
      <NotificationsView />
    </DashboardLayout>
  );
}
