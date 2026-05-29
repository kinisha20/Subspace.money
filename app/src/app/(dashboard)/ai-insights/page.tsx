import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIInsightsView } from "@/components/dashboard/AIInsightsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Insights",
  description: "AI-powered financial insights, spending predictions, and budget recommendations.",
};

export default function AIInsightsPage() {
  return (
    <DashboardLayout title="AI Insights" subtitle="Powered by your spending patterns">
      <AIInsightsView />
    </DashboardLayout>
  );
}
