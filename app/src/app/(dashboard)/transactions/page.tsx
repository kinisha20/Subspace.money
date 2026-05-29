import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionsView } from "@/components/dashboard/TransactionsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "All your financial transactions in one searchable, filterable view.",
};

export default function TransactionsPage() {
  return (
    <DashboardLayout title="Transactions" subtitle="All activity across accounts">
      <TransactionsView />
    </DashboardLayout>
  );
}
