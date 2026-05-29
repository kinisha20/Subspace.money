import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SubscriptionsView } from "@/components/dashboard/SubscriptionsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Track and manage all your recurring subscriptions.",
};

export default function SubscriptionsPage() {
  return (
    <DashboardLayout title="Subscriptions" subtitle="All recurring charges tracked">
      <SubscriptionsView />
    </DashboardLayout>
  );
}
