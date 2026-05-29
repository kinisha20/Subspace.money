import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subspace.money — AI-Powered Finance Management for Modern India",
  description:
    "Track subscriptions, split bills, automate savings, and manage investments with AI. India's most premium personal finance platform.",
};

export default function HomePage() {
  return (
    <div style={{ background: "#F5EFE7", minHeight: "100vh", fontFamily: "'Satoshi','General Sans','DM Sans',system-ui,sans-serif" }}>

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(245,239,231,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(15,95,86,0.08)",
        }}
        aria-label="Main navigation"
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 19, color: "#0F5F56", textDecoration: "none" }}>
            Subspace.money
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[["Features","#features"],["Pricing","#pricing"],["About","#about"]].map(([label,href]) => (
              <Link key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: "#0F5F56", background: "transparent", border: "1.5px solid rgba(15,95,86,0.28)", borderRadius: 999, padding: "9px 22px", textDecoration: "none" }}>
              Log in
            </Link>
            <Link href="/signup" style={{ fontSize: 14, fontWeight: 600, color: "#121212", background: "#7CCF5C", border: "none", borderRadius: 999, padding: "10px 24px", textDecoration: "none" }}>
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section style={{ padding: "108px 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 64, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 440px", maxWidth: 580 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(15,95,86,0.08)", border: "1px solid rgba(15,95,86,0.14)", borderRadius: 999, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#0F5F56", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CCF5C", display: "inline-block" }} />
              AI-powered finance for modern India
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(44px, 5.5vw, 68px)", color: "#121212", lineHeight: 1.06, letterSpacing: "-0.03em", margin: "0 0 20px" }}>
              Lift your money.<br /><em style={{ color: "#0F5F56" }}>Kill the weight.</em>
            </h1>
            <p style={{ fontSize: 17, color: "#6B6B6B", lineHeight: 1.65, maxWidth: 460, marginBottom: 36 }}>
              Subspace tracks every subscription, every rupee, every saving goal — so nothing pulls you under.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <Link href="/signup" style={{ fontSize: 15, fontWeight: 700, color: "#121212", background: "#7CCF5C", borderRadius: 999, padding: "14px 32px", textDecoration: "none", boxShadow: "0 8px 24px rgba(124,207,92,0.3)" }}>
                Start for free
              </Link>
              <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: "#0F5F56", background: "transparent", border: "1.5px solid rgba(15,95,86,0.28)", borderRadius: 999, padding: "13px 30px", textDecoration: "none" }}>
                See the dashboard
              </Link>
            </div>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>No credit card required. Free to start.</p>
          </div>

          {/* Dashboard preview card */}
          <div style={{ flex: "1 1 340px", maxWidth: 440 }}>
            <div style={{ background: "#0C2018", borderRadius: 20, padding: 24, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Balance</p>
                  <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 32, color: "#fff", letterSpacing: "-0.03em", marginTop: 2 }}>&#8377;1,24,580</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.16)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#4ADE80", marginTop: 6 }}>
                    &#x2197; +8.3% this month
                  </span>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124,207,92,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M3 15l4.5-5 3 3L15 5l2 4" stroke="#7CCF5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Monthly Savings", value: "&#8377;22,400", color: "#4ADE80" },
                  { label: "Subscriptions",   value: "&#8377;3,240",  color: "#F87171" },
                  { label: "AI Savings Found",value: "&#8377;3,569",  color: "#7CCF5C" },
                  { label: "Pending Splits",  value: "&#8377;1,800",  color: "#FBBF24" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }} dangerouslySetInnerHTML={{ __html: s.value }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, background: "rgba(124,207,92,0.07)", border: "1px solid rgba(124,207,92,0.14)", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#7CCF5C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>AI Insight</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>3 subscriptions unused for 50+ days. Cancelling saves &#8377;3,569/month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ───────────────────────────────────────── */}
      <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", padding: "40px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 28 }}>
          {[["100+","Beta users"],["&#8377;42L","Tracked in beta"],["380+","Subscriptions managed"],["4.9","User rating"],["&#8377;8,400","Avg. saved per user"]].map(([num, lbl], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 32, color: "#0F5F56", letterSpacing: "-0.03em", lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: num }} />
              <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 5, fontWeight: 500 }}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <section id="features" style={{ padding: "88px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0F5F56", marginBottom: 16 }}>Features</p>
        <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(28px, 3.4vw, 42px)", color: "#121212", letterSpacing: "-0.02em", marginBottom: 48 }}>Everything your money needs.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {[
            { title: "Subscription Tracker", desc: "Every recurring charge, visible and manageable. Know what renews, when, and whether you use it." },
            { title: "Smart Savings Goals",  desc: "Set targets, pick timelines. AI adjusts contributions based on what you actually earn and spend." },
            { title: "Group Finance",        desc: "Split shared expenses without awkward texts. Pools, UPI links, and automatic reminders." },
            { title: "AI Insights",          desc: "Not charts. Real recommendations — where to cut, where to invest, what to pause." },
          ].map((f) => (
            <div key={f.title} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 20, padding: "28px 26px", transition: "border-color 0.3s, box-shadow 0.3s" }}>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#121212", letterSpacing: "-0.01em", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0F5F56", marginBottom: 14 }}>Pricing</p>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(26px, 3.2vw, 38px)", color: "#121212", letterSpacing: "-0.02em", marginBottom: 48 }}>Simple, honest pricing.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { plan: "Free", price: "&#8377;0", per: "forever", features: ["5 subscriptions", "2 savings goals", "Basic analytics", "1 group"], cta: "Start free", ctaHref: "/signup", primary: false },
              { plan: "Pro",  price: "&#8377;199", per: "per month", features: ["Unlimited subscriptions", "Unlimited goals", "AI insights", "Unlimited groups", "Investment tracking"], cta: "Go Pro", ctaHref: "/signup", primary: true },
            ].map((p) => (
              <div key={p.plan} style={{ borderRadius: 24, padding: 36, background: p.primary ? "#0F5F56" : "#F5EFE7", border: p.primary ? "none" : "1.5px solid #E5E7EB", position: "relative" }}>
                {p.primary && <span style={{ position: "absolute", top: 16, right: 16, background: "#7CCF5C", color: "#121212", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 10px" }}>Most Popular</span>}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: p.primary ? "#7CCF5C" : "#6B6B6B", marginBottom: 10 }}>{p.plan}</p>
                <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 44, color: p.primary ? "#fff" : "#121212", letterSpacing: "-0.04em", lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: p.price }} />
                <p style={{ fontSize: 13, color: p.primary ? "rgba(255,255,255,0.45)" : "#9CA3AF", marginBottom: 24, marginTop: 4 }}>{p.per}</p>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: p.primary ? "rgba(255,255,255,0.82)" : "#374151" }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                        <circle cx="7.5" cy="7.5" r="7" fill={p.primary ? "rgba(124,207,92,0.15)" : "#EDE8DF"}/>
                        <path d="M4.5 7.5l2 2 4-4" stroke={p.primary ? "#7CCF5C" : "#0F5F56"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.ctaHref}
                  style={{
                    display: "block", width: "100%", textAlign: "center",
                    fontSize: 14, fontWeight: 600,
                    color: p.primary ? "#121212" : "#0F5F56",
                    background: p.primary ? "#7CCF5C" : "transparent",
                    border: p.primary ? "none" : "1.5px solid rgba(15,95,86,0.28)",
                    borderRadius: 999, padding: "13px", textDecoration: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: "#0F5F56", padding: "56px 32px 32px" }} role="contentinfo">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
            <div>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "#fff", marginBottom: 10 }}>Subspace.money</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", maxWidth: 220, lineHeight: 1.6 }}>AI-powered finance management built for modern India.</p>
            </div>
            {[
              { title: "Product", links: ["Features","Pricing","Dashboard","Changelog"] },
              { title: "Company", links: ["About","Blog","Careers","Press"] },
              { title: "Legal",   links: ["Privacy","Terms","Security","Refunds"] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{col.title}</p>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                  {col.links.map(l => (
                    <li key={l}><Link href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>&#169; 2026 Subspace.money. All rights reserved.</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Made with conviction.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
