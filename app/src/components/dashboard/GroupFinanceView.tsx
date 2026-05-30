"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { mockGroups } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { Plus, CheckCircle2, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/user-store";

// Gradient / solid color map keyed by first letter of member name
const AVATAR_COLORS: Record<string, string> = {
  A: "linear-gradient(135deg, #0F5F56, #1A7A6E)",
  R: "#E05252",
  S: "#7C3AED",
  P: "#2563EB",
  K: "#D97706",
  M: "#DB2777",
  V: "#059669",
};

function memberAvatarStyle(initials: string): React.CSSProperties {
  const letter = initials.charAt(0).toUpperCase();
  const color  = AVATAR_COLORS[letter] ?? "#374151";
  return { background: color };
}

export function GroupFinanceView() {
  const [isPro, setIsPro] = useState(true);

  useEffect(() => {
    setIsPro(getUser()?.plan === "pro");
  }, []);

  const displayedGroups = isPro ? mockGroups : mockGroups.slice(0, 1);

  const totalOwed = mockGroups.reduce((s, g) => {
    return s + g.members.filter(m => !m.paid && m.name !== "Aryan").reduce((ms, m) => ms + m.owes, 0);
  }, 0);

  return (
    <div className="space-y-5 page-enter">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {
          [
            { label: "Active Groups",  value: mockGroups.length.toString() },
            { label: "Total Owed",     value: formatINR(totalOwed) },
            { label: "You're Owed",   value: formatINR(totalOwed) },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4">
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">{s.label}</p>
              <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[24px] text-[#121212] tracking-tight">{s.value}</p>
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayedGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-[20px] border border-[#E5E7EB] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[18px] text-[#121212] tracking-tight">{group.name}</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{group.description}</p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[18px] text-[#121212] tracking-tight">{formatINR(group.totalAmount)}</p>
                <p className="text-[10px] text-[#9CA3AF]">total/month</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {group.members.map((member, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#F5EFE7] last:border-0">
                  <div className="flex items-center gap-2.5">
                    {/* Polished gradient avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm"
                      style={memberAvatarStyle(member.initials)}
                      aria-hidden="true"
                    >
                      {member.initials}
                    </div>
                    <span className="text-[13px] font-semibold text-[#121212]">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.paid ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                        <CheckCircle2 size={12} aria-hidden="true" /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                        <Clock size={12} aria-hidden="true" /> {formatINR(member.owes)} due
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[12px] text-[#9CA3AF]">
                Due {new Date(group.nextDue).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              </p>
              {/* Polished outline reminder button */}
              <button
                onClick={() => toast.success("Reminder sent to all members")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#0F5F56] text-[#0F5F56] text-[12px] font-semibold hover:bg-[#0F5F56] hover:text-white transition-all duration-200 active:scale-95"
              >
                <Bell size={12} aria-hidden="true" />
                Send reminder
              </button>
            </div>
          </div>
        ))}

        {/* Upgrade card for free plan */}
        {!isPro && mockGroups.length > 1 && (
          <div className="border-2 border-dashed border-[#7CCF5C]/40 rounded-[20px] p-6 flex items-center justify-between bg-[#7CCF5C]/5">
            <div>
              <p className="text-[13px] font-bold text-[#1A3C2A] mb-1">{mockGroups.length - 1} more group{mockGroups.length - 1 > 1 ? "s" : ""} locked</p>
              <p className="text-[12px] text-[#6B6B6B]">Free plan allows 1 group. Upgrade to manage unlimited groups.</p>
            </div>
            <Link href="/upgrade" className="text-[12px] font-bold bg-[#1A3C2A] text-white rounded-full px-4 py-2 no-underline flex-shrink-0 ml-4">Upgrade</Link>
          </div>
        )}

        {/* Create group dashed card */}
        <button
          id="create-group-btn"
          onClick={() => toast.info("Group creation coming soon")}
          className="group border-2 border-dashed border-[#E5E7EB] rounded-[20px] p-8 flex flex-col items-center justify-center gap-3 text-[#9CA3AF] hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50/40 transition-all duration-300 min-h-[220px]"
          aria-label="Create new group"
        >
          <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Plus size={22} aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-bold">Create group</p>
            <p className="text-[12px] opacity-70 mt-0.5">Split expenses with friends</p>
          </div>
        </button>
      </div>
    </div>
  );
}
