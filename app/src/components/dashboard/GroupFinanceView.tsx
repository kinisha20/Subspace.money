"use client";
import { mockGroups } from "@/lib/mock-data";
import { formatINR } from "@/lib/design-tokens";
import { Plus, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

export function GroupFinanceView() {
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
        {mockGroups.map((group) => (
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
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: member.avatar }}>
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
              <button
                onClick={() => toast.success("Reminder sent to all members")}
                className="px-4 py-1.5 rounded-full bg-[#0F5F56] text-white text-[12px] font-semibold hover:bg-[#083B35] transition-colors"
              >
                Send reminder
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => toast.info("Group creation coming soon")}
          className="border-2 border-dashed border-[#E5E7EB] rounded-[20px] p-5 flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:border-teal-300 hover:text-teal-500 transition-all duration-200 min-h-[200px]"
          aria-label="Create new group"
        >
          <Plus size={20} aria-hidden="true" />
          <span className="text-[13px] font-semibold">Create group</span>
        </button>
      </div>
    </div>
  );
}
