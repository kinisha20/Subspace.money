"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/user-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initials, setInitials] = useState("A");

  useEffect(() => {
    const u = getUser();
    if (u) setInitials(u.initials.charAt(0));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFE7]">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main content area */}
      <div
        className="
          lg:pl-[240px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          min-h-screen flex flex-col
        "
      >
        {/* Top header bar */}
        <header
          className="
            sticky top-0 z-30
            h-[64px] px-6
            flex items-center justify-between gap-4
            bg-[#F5EFE7]/90 backdrop-blur-sm
            border-b border-[rgba(15,95,86,0.08)]
          "
        >
          {/* Left: Mobile menu + Page title */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="
                lg:hidden flex items-center justify-center
                w-9 h-9 rounded-xl
                text-[#6B6B6B] hover:bg-[#EDE8DF]
                transition-colors duration-200
              "
              aria-label="Open navigation menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>

            {title && (
              <div className="min-w-0">
                <h1
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="text-[20px] text-[#121212] tracking-[-0.02em] truncate leading-tight"
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[12px] text-[#6B6B6B] mt-0.5 truncate font-['Satoshi','DM_Sans',sans-serif]">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions + Search + Notifications */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search */}
            <button
              className="
                hidden sm:flex items-center gap-2
                h-9 px-3 rounded-xl
                bg-white border border-[#E5E7EB]
                text-[13px] text-[#9CA3AF] font-medium
                hover:border-[rgba(15,95,86,0.3)]
                transition-colors duration-200
                cursor-pointer
              "
              aria-label="Search"
            >
              <Search size={14} className="text-[#9CA3AF]" aria-hidden="true" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline text-[10px] text-[#9CA3AF] bg-[#F5EFE7] px-1.5 py-0.5 rounded font-mono ml-1">
                ⌘K
              </kbd>
            </button>

            {/* Custom actions */}
            {actions}

            {/* Notifications */}
            <Link
              href="/notifications"
              className="
                relative flex items-center justify-center
                w-9 h-9 rounded-xl
                text-[#6B6B6B] hover:bg-[#EDE8DF] hover:text-[#121212]
                transition-colors duration-200
                no-underline
              "
              aria-label="Notifications — 2 unread"
            >
              <Bell size={18} aria-hidden="true" />
              {/* Unread badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7CCF5C] rounded-full" aria-hidden="true" />
            </Link>

            {/* Avatar */}
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 cursor-pointer no-underline"
              title="Account settings"
              aria-label="Open account settings"
            >
              <span className="text-xs font-bold text-white">{initials}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
