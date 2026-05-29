"use client";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Shield, CreditCard, Bell, Moon, Trash2, ChevronRight } from "lucide-react";

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  badge?: string;
  onClick: () => void;
}

function SettingRow({ icon: Icon, label, description, badge, onClick }: SettingRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-0 border-b border-[#F5EFE7] last:border-0 hover:opacity-75 transition-opacity text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-[#F5EFE7] flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-[#0F5F56]" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#121212]">{label}</p>
        {description && <p className="text-[12px] text-[#9CA3AF] mt-0.5">{description}</p>}
      </div>
      {badge && <span className="text-[11px] font-bold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">{badge}</span>}
      <ChevronRight size={15} className="text-[#9CA3AF]" aria-hidden="true" />
    </button>
  );
}

export function ProfileView() {
  const [name, setName] = useState("Aryan Gupta");
  const [email, setEmail] = useState("aryan@example.com");

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">

      {/* Profile card */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0F5F56] flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <span style={{ fontFamily: "'Instrument Serif', serif" }} className="text-2xl text-white">A</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[22px] text-[#121212] tracking-tight">{name}</h2>
            <span className="inline-flex text-[11px] font-bold text-[#7CCF5C] bg-[#7CCF5C]/10 px-2.5 py-0.5 rounded-full">Pro Plan</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F5EFE7] border-0 rounded-xl px-4 py-2.5 text-[14px] text-[#121212] outline-none focus:ring-2 focus:ring-teal-400/30"
              aria-label="Full name"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F5EFE7] border-0 rounded-xl px-4 py-2.5 text-[14px] text-[#121212] outline-none focus:ring-2 focus:ring-teal-400/30"
              aria-label="Email address"
            />
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#0F5F56] text-white text-[13px] font-semibold rounded-full hover:bg-[#083B35] transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5">
        <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Account</h3>
        <SettingRow icon={Shield}     label="Security & Privacy"    description="Password, 2FA, privacy settings" onClick={() => toast.info("Security settings")} />
        <SettingRow icon={CreditCard}  label="Billing & Subscription" description="Pro plan — renews June 15"       badge="Pro" onClick={() => toast.info("Billing")} />
        <SettingRow icon={Bell}        label="Notifications"          description="Manage alerts and reminders"      onClick={() => toast.info("Notification settings")} />
        <SettingRow icon={Moon}        label="Appearance"             description="Dark mode, theme preferences"     onClick={() => toast.info("Appearance")} />
      </div>

      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5">
        <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Connected</h3>
        <SettingRow icon={CreditCard} label="Linked accounts"       description="Bank accounts, UPI IDs"          onClick={() => toast.info("Account linking")} />
        <SettingRow icon={Shield}     label="Export data"           description="Download your financial data"    onClick={() => toast.info("Data export started")} />
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 rounded-[20px] border border-red-100 p-5">
        <h3 className="text-[14px] font-bold text-red-700 mb-3">Danger zone</h3>
        <button
          onClick={() => toast.error("Account deletion requires email confirmation")}
          className="flex items-center gap-2 text-[13px] font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 size={14} aria-hidden="true" /> Delete account
        </button>
      </div>
    </div>
  );
}
