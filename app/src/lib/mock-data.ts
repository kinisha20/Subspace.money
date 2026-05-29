import { CATEGORY_COLORS } from "./design-tokens";

// ─── Types ────────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  icon?: string;
  logoUrl?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: "monthly" | "yearly" | "weekly";
  nextRenewal: string;
  status: "active" | "paused" | "cancelled";
  category: string;
  used: boolean;
  lastUsed?: string;
  color: string;
  logoUrl?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  monthlyContribution: number;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  type: "mutual_fund" | "stock" | "fd" | "crypto" | "gold";
  invested: number;
  current: number;
  returns: number;
  returnsPercent: number;
  color: string;
}

export interface AIInsight {
  id: string;
  type: "save" | "warning" | "opportunity" | "tip";
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
}

export interface GroupMember {
  name: string;
  initials: string;
  avatar: string;
  owes: number;
  paid: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  myShare: number;
  members: GroupMember[];
  nextDue: string;
  status: "active" | "settled" | "pending";
}

// ─── Mock Data ────────────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  { id: "1",  date: "2026-05-29", description: "Netflix Premium",   amount: 649,   type: "debit",  category: "Entertainment", logoUrl: "https://logo.clearbit.com/netflix.com" },
  { id: "2",  date: "2026-05-28", description: "Salary Credit",     amount: 95000, type: "credit", category: "Income" },
  { id: "3",  date: "2026-05-27", description: "Spotify Premium",   amount: 119,   type: "debit",  category: "Entertainment", logoUrl: "https://logo.clearbit.com/spotify.com" },
  { id: "4",  date: "2026-05-26", description: "Zomato Order",      amount: 340,   type: "debit",  category: "Food",          logoUrl: "https://logo.clearbit.com/zomato.com" },
  { id: "5",  date: "2026-05-25", description: "Amazon Prime",      amount: 299,   type: "debit",  category: "Entertainment", logoUrl: "https://logo.clearbit.com/amazon.com" },
  { id: "6",  date: "2026-05-24", description: "Swiggy Order",      amount: 245,   type: "debit",  category: "Food",          logoUrl: "https://logo.clearbit.com/swiggy.com" },
  { id: "7",  date: "2026-05-23", description: "Freelance Payment", amount: 15000, type: "credit", category: "Income" },
  { id: "8",  date: "2026-05-22", description: "Electricity Bill",  amount: 1240,  type: "debit",  category: "Utilities" },
  { id: "9",  date: "2026-05-21", description: "Gym Membership",    amount: 1500,  type: "debit",  category: "Health",        logoUrl: "https://logo.clearbit.com/gymshark.com" },
  { id: "10", date: "2026-05-20", description: "Uber Ride",         amount: 180,   type: "debit",  category: "Transport",     logoUrl: "https://logo.clearbit.com/uber.com" },
  { id: "11", date: "2026-05-19", description: "Notion Pro",        amount: 400,   type: "debit",  category: "Subscriptions", logoUrl: "https://logo.clearbit.com/notion.so" },
  { id: "12", date: "2026-05-18", description: "Jio Recharge",      amount: 239,   type: "debit",  category: "Utilities",     logoUrl: "https://logo.clearbit.com/jio.com" },
];

export const mockSubscriptions: Subscription[] = [
  { id: "1", name: "Netflix",      amount: 649,  cycle: "monthly", nextRenewal: "2026-06-15", status: "active",  category: "Entertainment", used: true,  lastUsed: "2 days ago",  color: "#E50914", logoUrl: "https://logo.clearbit.com/netflix.com" },
  { id: "2", name: "Spotify",      amount: 119,  cycle: "monthly", nextRenewal: "2026-06-12", status: "active",  category: "Entertainment", used: true,  lastUsed: "Today",       color: "#1DB954", logoUrl: "https://logo.clearbit.com/spotify.com" },
  { id: "3", name: "Amazon Prime", amount: 1499, cycle: "yearly",  nextRenewal: "2026-08-10", status: "active",  category: "Shopping",      used: false, lastUsed: "54 days ago", color: "#FF9900", logoUrl: "https://logo.clearbit.com/amazon.com" },
  { id: "4", name: "Notion Pro",   amount: 400,  cycle: "monthly", nextRenewal: "2026-06-20", status: "active",  category: "Productivity",  used: false, lastUsed: "48 days ago", color: "#000000", logoUrl: "https://logo.clearbit.com/notion.so" },
  { id: "5", name: "Cult.fit",     amount: 1500, cycle: "monthly", nextRenewal: "2026-06-01", status: "active",  category: "Health",        used: true,  lastUsed: "Yesterday",   color: "#FF6B35", logoUrl: "https://logo.clearbit.com/cult.fit" },
  { id: "6", name: "Jio 5G",       amount: 239,  cycle: "monthly", nextRenewal: "2026-06-05", status: "active",  category: "Utilities",     used: true,  lastUsed: "Today",       color: "#0052CC", logoUrl: "https://logo.clearbit.com/jio.com" },
  { id: "7", name: "ChatGPT Plus", amount: 1670, cycle: "monthly", nextRenewal: "2026-06-08", status: "paused",  category: "AI Tools",      used: false, lastUsed: "62 days ago", color: "#10A37F", logoUrl: "https://logo.clearbit.com/openai.com" },
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: "1", name: "Goa Trip",      target: 40000, current: 28500, deadline: "2026-08-15", category: "Travel",  monthlyContribution: 5000, color: "#7CCF5C" },
  { id: "2", name: "Emergency Fund",target: 300000,current: 180000,deadline: "2026-12-31", category: "Safety",  monthlyContribution: 10000,color: "#0F5F56" },
  { id: "3", name: "MacBook Pro",   target: 200000,current: 80000, deadline: "2026-09-01", category: "Tech",    monthlyContribution: 15000,color: "#60B4FF" },
  { id: "4", name: "Wedding Fund",  target: 500000,current: 125000,deadline: "2027-03-15", category: "Life",    monthlyContribution: 20000,color: "#F472B6" },
];

export const mockInvestments: Investment[] = [
  { id: "1", name: "Nifty 50 Index Fund",  type: "mutual_fund", invested: 120000, current: 142800, returns: 22800, returnsPercent: 19.0, color: "#7CCF5C" },
  { id: "2", name: "HDFC Small Cap Fund",  type: "mutual_fund", invested: 60000,  current: 74400,  returns: 14400, returnsPercent: 24.0, color: "#176F64" },
  { id: "3", name: "Digital Gold",         type: "gold",        invested: 25000,  current: 27250,  returns: 2250,  returnsPercent: 9.0,  color: "#F3C94C" },
  { id: "4", name: "HDFC Bank FD",         type: "fd",          invested: 100000, current: 107000, returns: 7000,  returnsPercent: 7.0,  color: "#60B4FF" },
  { id: "5", name: "Reliance Industries",  type: "stock",       invested: 50000,  current: 58500,  returns: 8500,  returnsPercent: 17.0, color: "#FB923C" },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: "1",
    type: "save",
    title: "3 subscriptions unused for 50+ days",
    description: "Amazon Prime, Notion Pro, and ChatGPT Plus total ₹3,569/month but show no recent usage. You could save ₹42,828 annually by pausing or cancelling these.",
    impact: "₹3,569/month",
    actionLabel: "Review subscriptions",
  },
  {
    id: "2",
    type: "opportunity",
    title: "Increase SIP to hit Goa goal on time",
    description: "At your current contribution of ₹5,000/month, you'll reach your Goa trip goal 3 weeks late. Increasing by ₹800/month ensures you hit the August 15 deadline.",
    impact: "+₹800/month",
    actionLabel: "Adjust contribution",
  },
  {
    id: "3",
    type: "warning",
    title: "Food spending up 34% this month",
    description: "You've spent ₹8,200 on food this month — 34% above your monthly average of ₹6,100. Most of this increase is from late-night Swiggy orders.",
    impact: "+₹2,100 vs avg",
    actionLabel: "See breakdown",
  },
  {
    id: "4",
    type: "tip",
    title: "Move idle ₹18,000 to liquid fund",
    description: "You've had ₹18,000 sitting in your savings account for 45 days earning 3.5%. A liquid mutual fund could earn 6–7% with the same flexibility.",
    impact: "₹585 extra/year",
    actionLabel: "Explore options",
  },
];

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Flat 4B",
    description: "Shared utilities, OTT, and groceries",
    totalAmount: 4200,
    myShare: 1050,
    nextDue: "2026-06-01",
    status: "active",
    members: [
      { name: "Aryan", initials: "A", avatar: "#1F5C4A", owes: 0,   paid: true  },
      { name: "Riya",  initials: "R", avatar: "#3D7A6A", owes: 1050, paid: false },
      { name: "Sameer",initials: "S", avatar: "#4A8878", owes: 1050, paid: false },
      { name: "Priya", initials: "P", avatar: "#2A6B58", owes: 1050, paid: true  },
    ],
  },
  {
    id: "2",
    name: "Netflix Group",
    description: "Premium shared plan",
    totalAmount: 649,
    myShare: 163,
    nextDue: "2026-06-15",
    status: "active",
    members: [
      { name: "Aryan",  initials: "A", avatar: "#1F5C4A", owes: 0,   paid: true  },
      { name: "Karan",  initials: "K", avatar: "#4A7C59", owes: 163, paid: false },
      { name: "Meera",  initials: "M", avatar: "#2A5248", owes: 163, paid: true  },
      { name: "Vikram", initials: "V", avatar: "#3D7A6A", owes: 163, paid: false },
    ],
  },
];

export const mockSpendingByMonth = [
  { month: "Dec", amount: 38200 },
  { month: "Jan", amount: 42400 },
  { month: "Feb", amount: 35100 },
  { month: "Mar", amount: 51800 },
  { month: "Apr", amount: 44200 },
  { month: "May", amount: 48600 },
];

export const mockSpendingByCategory = [
  { name: "Entertainment", value: 3200, color: CATEGORY_COLORS.Entertainment },
  { name: "Food",          value: 8200, color: CATEGORY_COLORS.Food },
  { name: "Subscriptions", value: 4000, color: CATEGORY_COLORS.Subscriptions },
  { name: "Utilities",     value: 2400, color: CATEGORY_COLORS.Utilities },
  { name: "Health",        value: 1500, color: CATEGORY_COLORS.Health },
  { name: "Transport",     value: 1800, color: CATEGORY_COLORS.Transport },
  { name: "Shopping",      value: 5400, color: CATEGORY_COLORS.Shopping },
  { name: "Other",         value: 2100, color: CATEGORY_COLORS.Other },
];

export const mockSavingsOverTime = [
  { month: "Dec", savings: 18000 },
  { month: "Jan", savings: 14000 },
  { month: "Feb", savings: 22000 },
  { month: "Mar", savings: 19000 },
  { month: "Apr", savings: 25000 },
  { month: "May", savings: 22400 },
];

export const mockDashboardStats = {
  totalBalance:    124580,
  monthlySavings:  22400,
  subscriptions:   3240,
  pendingSplits:   1800,
  savingsRate:     23.6,
  balanceChange:   8.3,
  savingsChange:   4200,
  investmentValue: 409950,
};

export const mockNotifications = [
  { id: "1", type: "renewal", title: "Netflix renews in 3 days", message: "₹649 will be charged on June 15", time: "2 hours ago", read: false },
  { id: "2", type: "insight", title: "New AI insight available", message: "We found ₹3,569 in unused subscriptions", time: "4 hours ago", read: false },
  { id: "3", type: "goal",    title: "Goa trip goal at 71%", message: "₹11,500 more to reach your target", time: "Yesterday", read: true },
  { id: "4", type: "group",   title: "Riya paid her share", message: "Netflix group payment settled", time: "2 days ago", read: true },
  { id: "5", type: "warning", title: "Unusual spending detected", message: "Food spending is 34% above average", time: "3 days ago", read: true },
];
