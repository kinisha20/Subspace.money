"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ArrowLeftRight,
  Sparkles,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",      label: "Dashboard",    icon: LayoutDashboard },
  { href: "/analytics",      label: "Analytics",    icon: BarChart3 },
  { href: "/transactions",   label: "Transactions", icon: ArrowLeftRight },
  { href: "/ai-insights",    label: "AI Insights",  icon: Sparkles },
  { href: "/subscriptions",  label: "Subscriptions",icon: CreditCard },
  { href: "/savings",        label: "Savings",      icon: PiggyBank },
  { href: "/investments",    label: "Investments",  icon: TrendingUp },
  { href: "/group-finance",  label: "Group Finance",icon: Users },
];

const bottomItems = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile",       label: "Settings",      icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose();
  }, [pathname]);

  // Close mobile sidebar on overlay click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (overlayRef.current && e.target === overlayRef.current) {
        onMobileClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onMobileClose]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          flex flex-col
          bg-white border-r border-gray-100
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${collapsed ? "w-[64px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-[1px_0_0_rgba(0,0,0,0.04),4px_0_16px_rgba(0,0,0,0.04)]
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-[64px] border-b border-gray-50 flex-shrink-0 ${collapsed ? "justify-center px-4" : "px-5"}`}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L10 6H14L11 9L12 13L8 10.5L4 13L5 9L2 6H6L8 2Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <span
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="text-[17px] text-[#121212] tracking-[-0.02em] whitespace-nowrap"
              >
                Subspace
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L10 6H14L11 9L12 13L8 10.5L4 13L5 9L2 6H6L8 2Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 no-scrollbar" aria-label="Sidebar navigation">
          <ul role="list" className="flex flex-col gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      flex items-center gap-3 rounded-xl
                      px-3 py-2.5 text-sm font-medium
                      transition-all duration-200 no-underline
                      ${collapsed ? "justify-center" : ""}
                      ${active
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-[#6B6B6B] hover:bg-[#F5EFE7] hover:text-[#121212]"
                      }
                    `}
                    title={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="whitespace-nowrap">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom items */}
          <div className="mt-6 pt-4 border-t border-gray-50">
            <ul role="list" className="flex flex-col gap-0.5">
              {bottomItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`
                        flex items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm font-medium
                        transition-all duration-200 no-underline
                        ${collapsed ? "justify-center" : ""}
                        ${active
                          ? "bg-teal-500 text-white"
                          : "text-[#6B6B6B] hover:bg-[#F5EFE7] hover:text-[#121212]"
                        }
                      `}
                      title={collapsed ? label : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* User area */}
        <div className={`border-t border-gray-50 p-3 flex-shrink-0 ${collapsed ? "flex justify-center" : ""}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#F5EFE7] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#121212] truncate">Aryan Gupta</div>
                <div className="text-[11px] text-[#6B6B6B] truncate">Pro plan</div>
              </div>
              <LogOut size={14} className="text-[#9CA3AF] flex-shrink-0" aria-hidden="true" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center cursor-pointer" title="Account">
              <span className="text-xs font-bold text-white">A</span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            hidden lg:flex absolute -right-3 top-[82px]
            w-6 h-6 rounded-full bg-white border border-gray-200
            items-center justify-center
            shadow-sm text-[#6B6B6B] hover:text-teal-500
            transition-colors duration-200
            cursor-pointer
          "
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight size={12} aria-hidden="true" />
            : <ChevronLeft size={12} aria-hidden="true" />
          }
        </button>
      </aside>
    </>
  );
}
