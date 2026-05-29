"use client";
import { useState } from "react";
import { mockNotifications } from "@/lib/mock-data";
import { Bell, Sparkles, Target, Users, AlertTriangle, CheckCheck } from "lucide-react";

const notifIcons: Record<string, React.ElementType> = {
  renewal: Bell,
  insight: Sparkles,
  goal:    Target,
  group:   Users,
  warning: AlertTriangle,
};

export function NotificationsView() {
  const [notifs, setNotifs] = useState(mockNotifications);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6B6B6B]">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-teal-500 hover:text-teal-600 transition-colors"
          >
            <CheckCheck size={13} aria-hidden="true" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.map((notif) => {
          const Icon = notifIcons[notif.type] || Bell;
          return (
            <div
              key={notif.id}
              onClick={() => setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
              className={`bg-white rounded-[16px] border p-4 flex items-start gap-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                notif.read ? "border-[#E5E7EB] opacity-70" : "border-teal-200 shadow-sm"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.read ? "bg-[#F5EFE7]" : "bg-teal-50"
              }`}>
                <Icon size={16} className={notif.read ? "text-[#9CA3AF]" : "text-teal-500"} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-[13px] font-bold ${notif.read ? "text-[#6B6B6B]" : "text-[#121212]"}`}>{notif.title}</p>
                  {!notif.read && <span className="w-2 h-2 bg-[#7CCF5C] rounded-full flex-shrink-0 mt-1.5" aria-label="Unread" />}
                </div>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">{notif.message}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1.5">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
