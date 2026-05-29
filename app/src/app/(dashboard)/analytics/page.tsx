import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Detailed spending analytics, category breakdowns, and financial trends.",
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Spending patterns and financial trends"
    >
      <AnalyticsView />
    </DashboardLayout>
  );
}
