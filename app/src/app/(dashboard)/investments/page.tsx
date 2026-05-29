import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InvestmentsView } from "@/components/dashboard/InvestmentsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investments",
  description: "Track your investment portfolio, returns, and allocation.",
};

export default function InvestmentsPage() {
  return (
    <DashboardLayout title="Investments" subtitle="Portfolio overview and performance">
      <InvestmentsView />
    </DashboardLayout>
  );
}
