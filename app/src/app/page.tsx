import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subspace.money — AI-Powered Finance Management for Modern India",
  description:
    "Track subscriptions, split bills, automate savings, and manage investments with AI. India's most premium personal finance platform.",
};

export default function HomePage() {
  return (
    <div style={{ background: "#F5EFE7", minHeight: "100vh", fontFamily: "'Satoshi','DM Sans',system-ui,sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,239,231,0.94)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(15,95,86,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0F5F56", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="#7CCF5C" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" fill="#7CCF5C"/></svg>
            </div>
            <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "#0F5F56" }}>subspace.money</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[["What", "#what"], ["Why", "#why"], ["Features", "#features"], ["About", "#about"], ["Pricing", "#pricing"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: "#0F5F56", border: "1.5px solid rgba(15,95,86,0.3)", borderRadius: 999, padding: "9px 22px", textDecoration: "none" }}>Login</Link>
            <Link href="/signup" style={{ fontSize: 14, fontWeight: 700, color: "#121212", background: "#7CCF5C", borderRadius: 999, padding: "10px 24px", textDecoration: "none", boxShadow: "0 4px 14px rgba(124,207,92,0.35)" }}>Start for free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding: "90px 28px 70px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px", maxWidth: 560 }}>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(42px,5.5vw,66px)", color: "#121212", lineHeight: 1.08, letterSpacing: "-0.03em", margin: "0 0 22px" }}>
              <span style={{ background: "#7CCF5C", borderRadius: 6, padding: "0 6px", display: "inline" }}>Helping</span> you<br />manage<br />your money<br />better
            </h1>
            <p style={{ fontSize: 16, color: "#6B6B6B", lineHeight: 1.7, maxWidth: 430, marginBottom: 32 }}>
              No app made finance management easy until Subspace.money came along. It&apos;s designed with one clear goal: save money.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <Link href="/signup" style={{ fontSize: 15, fontWeight: 700, color: "#121212", background: "#7CCF5C", borderRadius: 999, padding: "14px 32px", textDecoration: "none", boxShadow: "0 8px 24px rgba(124,207,92,0.3)" }}>Try it now</Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex" }}>
                {["A","B","C","D","E"].map((l, i) => (
                  <div key={l} style={{ width: 32, height: 32, borderRadius: "50%", background: ["#0F5F56","#7CCF5C","#374151","#0F5F56","#7CCF5C"][i], border: "2px solid #F5EFE7", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{l}</div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>Trusted by <strong>100+</strong> beta users</p>
            </div>
          </div>

          {/* Dashboard preview */}
          <div style={{ flex: "1 1 300px", maxWidth: 400 }}>
            <div style={{ background: "#0C2018", borderRadius: 24, padding: 22, boxShadow: "0 32px 80px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>DASHBOARD</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>TOTAL BALANCE</p>
                  <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 30, color: "#fff", letterSpacing: "-0.02em" }}>&#8377;1,24,580.00</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.16)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#4ADE80", marginTop: 6 }}>&#x2197; +11.3% Outstanding balance boost</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>{[1,2,3,4].map(i=><div key={i} style={{width:10,height:10,borderRadius:2,background:"rgba(255,255,255,0.15)"}}/>)}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[["🏠","Saving","₹1,09,500","75%"],["🛍","Shopping","₹14,760","96%"],["🏖","Vacation","₹23,253","84%"]].map(([icon,label,val,pct])=>(
                  <div key={label} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 10px"}}>
                    <p style={{fontSize:16,marginBottom:4}}>{icon}</p>
                    <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:2}}>{label}</p>
                    <p style={{fontSize:13,fontWeight:700,color:"#fff"}}>{val}</p>
                    <p style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{pct}</p>
                  </div>
                ))}
              </div>
              {[["Budget for June","You&apos;re on track for this month.","₹28,793","#7CCF5C"],["Create a saving goal","You don&apos;t need to make more money. Just save more money","",""],["Budget for June","Monthly overview","₹12,395",""]].map(([title,desc,val,color],i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:"#fff"}}>{title}</p>
                    <p style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2}}>{desc}</p>
                  </div>
                  {val && <p style={{fontSize:13,fontWeight:700,color:color||"#fff"}}>{val}</p>}
                  {!val && <div style={{width:24,height:24,borderRadius:"50%",background:"#0F5F56",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff"}}>+</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT ─────────────────────────────────────────── */}
      <section id="what" style={{ background: "#0F5F56", padding: "72px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7CCF5C", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>The platform</p>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(28px,3.5vw,44px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 24 }}>What is Subspace.money?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 24px" }}>
            Subspace is a personal finance platform that brings everything together — subscriptions, savings, investments, and group expenses — in one place. It uses AI to find where your money is quietly leaking and tells you exactly how to stop it.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            Most people pay for 3–5 subscriptions they forgot about. Most people have no savings goal. Most people split bills with awkward texts. Subspace fixes all of that — beautifully.
          </p>
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────── */}
      <section id="why" style={{ padding: "80px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#0F5F56", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Why Subspace</p>
        <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(28px,3.4vw,42px)", color: "#121212", letterSpacing: "-0.02em", marginBottom: 52 }}>It works differently.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
          {[
            { num: "01", title: "It tracks what banks ignore.", desc: "Your bank shows you transactions. Subspace shows you patterns — what you pay for regularly, what you never use, and what's silently growing." },
            { num: "02", title: "Savings that follow your income.", desc: "Set a goal, pick a deadline. Subspace auto-adjusts how much to save each month based on what you actually earn and spend — not a fixed estimate." },
            { num: "03", title: "Group money, without the awkward forms.", desc: "Add members to a group, log shared expenses, and Subspace calculates who owes what. No spreadsheets, no screenshots, no awkward texts." },
          ].map((item) => (
            <div key={item.num}>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 40, color: "#E5E7EB", letterSpacing: "-0.04em", marginBottom: 8 }}>{item.num}</p>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#121212", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" style={{ background: "#fff", padding: "80px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#0F5F56", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>Features</p>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(26px,3.2vw,40px)", color: "#121212", letterSpacing: "-0.02em", marginBottom: 48, textAlign: "center" }}>Everything your money needs.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
            {[
              { title: "Track Subscriptions", desc: "Know exactly what you pay, when it renews, and whether you actually use it. Never pay for something you forgot about.", icon: "📋" },
              { title: "Split Bills", desc: "Split shared expenses without awkward texts. Add members, log costs, and Subspace calculates who owes what instantly.", icon: "🤝" },
              { title: "Savings Goals", desc: "Set a target and a deadline. AI automatically adjusts how much to save each month based on your real income and spending.", icon: "🎯" },
              { title: "AI Analytics", desc: "Not just charts — real recommendations. Where to cut, where to invest, what to pause. Personalised to your money.", icon: "✨" },
            ].map((f) => (
              <div key={f.title} style={{ background: "#F5EFE7", border: "1.5px solid #E5E7EB", borderRadius: 20, padding: "28px 24px" }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: "#121212", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#6B6B6B", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "80px 28px", maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#0F5F56", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>Pricing</p>
        <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(26px,3.2vw,40px)", color: "#121212", letterSpacing: "-0.02em", marginBottom: 48, textAlign: "center" }}>Simple, honest pricing.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 640, margin: "0 auto" }}>
          {[
            { plan: "Free", price: "₹0", per: "forever", features: ["5 subscriptions", "2 savings goals", "Basic analytics", "1 group"], cta: "Start free", href: "/signup", primary: false },
            { plan: "Pro", price: "₹190", per: "per month", features: ["Unlimited subscriptions", "Unlimited goals", "AI insights", "Unlimited groups", "Investment tracking"], cta: "Go Pro", href: "/signup", primary: true },
          ].map((p) => (
            <div key={p.plan} style={{ borderRadius: 24, padding: "36px 32px", background: p.primary ? "#0F5F56" : "#F5EFE7", border: p.primary ? "none" : "1.5px solid #E5E7EB", position: "relative" }}>
              {p.primary && <span style={{ position: "absolute", top: 16, right: 16, background: "#7CCF5C", color: "#121212", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 10px" }}>Popular</span>}
              <p style={{ fontSize: 11, fontWeight: 700, color: p.primary ? "#7CCF5C" : "#6B6B6B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{p.plan}</p>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, color: p.primary ? "#fff" : "#121212", letterSpacing: "-0.04em", lineHeight: 1 }}>{p.price}</p>
              <p style={{ fontSize: 13, color: p.primary ? "rgba(255,255,255,0.45)" : "#9CA3AF", marginBottom: 28, marginTop: 6 }}>{p.per}</p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: p.primary ? "rgba(255,255,255,0.82)" : "#374151" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" fill={p.primary ? "rgba(124,207,92,0.2)" : "#EDE8DF"}/><path d="M5 8l2 2 4-4" stroke={p.primary ? "#7CCF5C" : "#0F5F56"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} style={{ display: "block", textAlign: "center", fontSize: 14, fontWeight: 700, color: p.primary ? "#121212" : "#0F5F56", background: p.primary ? "#7CCF5C" : "transparent", border: p.primary ? "none" : "1.5px solid rgba(15,95,86,0.3)", borderRadius: 999, padding: "13px", textDecoration: "none" }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "80px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#0F5F56", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>Beta community</p>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(24px,3vw,38px)", color: "#121212", letterSpacing: "-0.02em", marginBottom: 44, textAlign: "center" }}>From the beta community.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {[
              { quote: "Subspace.money literally saved me ₹4,200/month in subscriptions I didn't even know I had. The AI caught everything.", name: "Aryan S.", role: "Engineering student, IIT Delhi" },
              { quote: "The group finance feature is insane. My friends and I split rent and groceries through it — no more awkward WhatsApp messages.", name: "Priya M.", role: "Product Manager, Bengaluru" },
              { quote: "Finally an app that understands Indian finances. UPI-first, INR everywhere, and the insights are actually useful.", name: "Rohit K.", role: "Freelance designer, Mumbai" },
            ].map((t) => (
              <div key={t.name} style={{ background: "#F5EFE7", borderRadius: 20, padding: "28px 24px", border: "1.5px solid #E5E7EB" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#F59E0B", fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0F5F56", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.name[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#121212" }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "#9CA3AF" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ background: "#0F5F56", padding: "80px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#7CCF5C", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Get started</p>
        <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(28px,4vw,52px)", color: "#fff", letterSpacing: "-0.03em", marginBottom: 20 }}>Ready to lift your money?</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 36 }}>Free to start. No credit card required.</p>
        <Link href="/signup" style={{ display: "inline-block", fontSize: 15, fontWeight: 700, color: "#121212", background: "#7CCF5C", borderRadius: 999, padding: "15px 36px", textDecoration: "none", boxShadow: "0 8px 28px rgba(124,207,92,0.3)" }}>Start for free — it&apos;s free</Link>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ background: "#0A1A12", padding: "56px 28px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 36, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ maxWidth: 220 }}>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: "#fff", marginBottom: 10 }}>subspace.money</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>AI-powered finance management built for modern India.</p>
            </div>
            {[
              { title: "Product", links: ["Dashboard", "Subscriptions", "Savings Goals", "Group Finance", "AI Insights"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Refunds"] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{col.title}</p>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l) => (
                    <li key={l}><Link href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>&#169; 2026 Subspace.money. All rights reserved.</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>Made with conviction.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
