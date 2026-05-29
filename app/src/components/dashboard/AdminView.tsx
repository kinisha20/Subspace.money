"use client";
import { formatINR } from "@/lib/design-tokens";
import { Users, TrendingUp, CreditCard, Server, AlertCircle, CheckCircle2 } from "lucide-react";

const adminStats = [
  { label: "Total Users",        value: "142",          sub: "+12 this week",     icon: Users,      positive: true  },
  { label: "MRR",                value: formatINR(24000), sub: "+18% this month",  icon: TrendingUp,  positive: true  },
  { label: "Active Subscriptions",value: "538",          sub: "across all users",  icon: CreditCard,  positive: null  },
  { label: "API Health",         value: "99.8%",         sub: "Last 30 days",      icon: Server,      positive: true  },
];

const systemHealth = [
  { service: "API Gateway",     status: "operational",  latency: "42ms"  },
  { service: "Database",        status: "operational",  latency: "8ms"   },
  { service: "AI Service",      status: "operational",  latency: "280ms" },
  { service: "Payment Service", status: "operational",  latency: "120ms" },
  { service: "Notification Service", status: "operational", latency: "65ms" },
];

const recentUsers = [
  { name: "Arjun M.",  email: "arjun@...",  plan: "Pro",  joined: "Today"       },
  { name: "Riya S.",   email: "riya@...",   plan: "Free", joined: "Yesterday"   },
  { name: "Karan P.", email: "karan@...", plan: "Pro",  joined: "2 days ago"  },
  { name: "Meera V.", email: "meera@...", plan: "Pro",  joined: "3 days ago"  },
  { name: "Vikram D.",email: "vikram@...",plan: "Free", joined: "4 days ago"  },
];

export function AdminView() {
  return (
    <div className="space-y-5 page-enter">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-[20px] border border-[#E5E7EB] px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{s.label}</p>
                <Icon size={15} className="text-[#9CA3AF]" aria-hidden="true" />
              </div>
              <p style={{ fontFamily: "'Instrument Serif', serif" }} className={`text-[24px] tracking-tight ${ s.positive ? "text-[#121212]" : "text-[#121212]" }`}>{s.value}</p>
              <p className={`text-[11px] mt-1 font-semibold ${s.positive ? "text-green-600" : "text-[#9CA3AF]"}`}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* System health */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5">
          <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">System Health</h2>
          <div className="space-y-2">
            {systemHealth.map((s) => (
              <div key={s.service} className="flex items-center justify-between py-2.5 border-b border-[#F5EFE7] last:border-0">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-green-500" aria-hidden="true" />
                  <span className="text-[13px] font-semibold text-[#121212]">{s.service}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#9CA3AF]">{s.latency}</span>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5">
          <h2 style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[17px] text-[#121212] tracking-tight mb-4">Recent Signups</h2>
          <div className="space-y-1">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F5EFE7] last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F5F56] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#121212]">{u.name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{u.joined}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  u.plan === "Pro" ? "text-[#7CCF5C] bg-[#7CCF5C]/10" : "text-[#9CA3AF] bg-[#F5EFE7]"
                }`}>{u.plan}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
