export type Plan = "free" | "pro";

export interface DemoUser {
  name: string;
  email: string;
  initials: string;
  plan: Plan;
}

const DEMO_ACCOUNTS: Record<string, DemoUser & { password: string }> = {
  "demo@subspace.money": {
    name: "Aryan Gupta",
    email: "demo@subspace.money",
    initials: "AG",
    plan: "pro",
    password: "demo1234",
  },
  "free@subspace.money": {
    name: "Priya Sharma",
    email: "free@subspace.money",
    initials: "PS",
    plan: "free",
    password: "free1234",
  },
};

const KEY = "subspace_user";

export function loginUser(email: string, password: string): DemoUser | null {
  const account = DEMO_ACCOUNTS[email.toLowerCase().trim()];
  if (!account) return null;
  if (account.password !== password) return null;
  const user: DemoUser = { name: account.name, email: account.email, initials: account.initials, plan: account.plan };
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(user));
  }
  return user;
}

export function getUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

export function setDefaultUser(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEY)) {
    const user: DemoUser = { name: "Aryan Gupta", email: "demo@subspace.money", initials: "AG", plan: "pro" };
    localStorage.setItem(KEY, JSON.stringify(user));
  }
}

export function logoutUser(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function isPro(): boolean {
  return getUser()?.plan === "pro";
}
