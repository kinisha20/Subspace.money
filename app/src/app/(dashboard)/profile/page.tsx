import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileView } from "@/components/dashboard/ProfileView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & Settings",
  description: "Manage your account, preferences, and connected services.",
};

export default function ProfilePage() {
  return (
    <DashboardLayout title="Profile & Settings" subtitle="Manage your account">
      <ProfileView />
    </DashboardLayout>
  );
}
