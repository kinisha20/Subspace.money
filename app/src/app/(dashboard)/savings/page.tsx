import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsView } from "@/components/dashboard/SavingsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings Goals",
  description: "Track and manage your savings goals.",
};

export default function SavingsPage() {
  return (
    <DashboardLayout title="Savings Goals" subtitle="Progress on all your targets">
      <SavingsView />
    </DashboardLayout>
  );
}
