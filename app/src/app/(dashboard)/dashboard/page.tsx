"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { getUser, setDefaultUser } from "@/lib/user-store";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setDefaultUser();
    const user = getUser();
    if (user) setUserName(user.name.split(" ")[0]); // first name only

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <DashboardLayout
      title={userName ? `${greeting}, ${userName}` : greeting}
      subtitle={today}
    >
      <DashboardHome />
    </DashboardLayout>
  );
}
