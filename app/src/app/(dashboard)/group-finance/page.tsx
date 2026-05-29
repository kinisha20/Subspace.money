import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GroupFinanceView } from "@/components/dashboard/GroupFinanceView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Finance",
  description: "Manage shared expenses, group pools, and bill splitting.",
};

export default function GroupFinancePage() {
  return (
    <DashboardLayout title="Group Finance" subtitle="Shared pools and bill splitting">
      <GroupFinanceView />
    </DashboardLayout>
  );
}
