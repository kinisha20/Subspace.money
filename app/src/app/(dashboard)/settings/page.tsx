"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Bell, Shield, CreditCard, User, Globe, Moon, ChevronRight, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User,       label: "Personal Information",  desc: "Name, email, phone number" },
      { icon: Shield,     label: "Security & Password",   desc: "2FA, password, sessions" },
      { icon: CreditCard, label: "Billing & Plan",        desc: "Pro plan · ₹299/month" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell,       label: "Notifications",         desc: "Renewals, goals, insights" },
      { icon: Globe,      label: "Currency & Region",     desc: "INR · Asia/Kolkata" },
      { icon: Smartphone, label: "Linked Accounts",       desc: "UPI, bank accounts" },
    ],
  },
];

const TOGGLES = [
  { id: "renewal_alerts",   label: "Renewal reminders",      desc: "3 days before billing",     default: true  },
  { id: "goal_milestones",  label: "Goal milestone alerts",  desc: "25%, 50%, 75%, 100%",       default: true  },
  { id: "weekly_summary",   label: "Weekly spending digest", desc: "Every Sunday morning",      default: false },
  { id: "unused_subs",      label: "Unused subscription alerts", desc: "After 45 days inactive", default: true  },
  { id: "dark_mode",        label: "Dark mode",              desc: "Coming soon",               default: false },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState(
    Object.fromEntries(TOGGLES.map((t) => [t.id, t.default]))
  );

  const toggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Preference saved");
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="space-y-6 page-enter max-w-2xl">

        {/* Section groups */}
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[16px] text-[#121212] tracking-tight mb-3"
            >
              {section.title}
            </h2>
            <div className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden divide-y divide-[#F5EFE7]">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => toast.info(`${item.label} — coming soon`)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#FDFAF7] transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F5EFE7] flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-[#0F5F56]" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#121212]">{item.label}</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight size={15} className="text-[#9CA3AF] flex-shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Notification toggles */}
        <div>
          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[16px] text-[#121212] tracking-tight mb-3"
          >
            Notifications & Display
          </h2>
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] overflow-hidden divide-y divide-[#F5EFE7]">
            {TOGGLES.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[13px] font-semibold text-[#121212]">{t.label}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={toggles[t.id]}
                  aria-label={t.label}
                  onClick={() => toggle(t.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    toggles[t.id] ? "bg-[#0F5F56]" : "bg-[#E5E7EB]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center ${
                      toggles[t.id] ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {toggles[t.id] && <Check size={10} className="text-[#0F5F56]" aria-hidden="true" />}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[16px] text-red-600 tracking-tight mb-3"
          >
            Danger Zone
          </h2>
          <div className="bg-white rounded-[20px] border border-red-100 overflow-hidden divide-y divide-red-50">
            {["Export all data", "Delete account"].map((action) => (
              <button
                key={action}
                onClick={() => toast.error(`${action} — contact support`)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors text-left"
              >
                <span className="text-[13px] font-semibold text-red-600">{action}</span>
                <ChevronRight size={15} className="text-red-300" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
