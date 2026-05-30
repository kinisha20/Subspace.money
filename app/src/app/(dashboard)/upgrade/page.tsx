"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/user-store";

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentMethod = "upi" | "debit" | "credit" | "netbanking";
type Step = 1 | 2 | 3;

// ─── Bank data ────────────────────────────────────────────────────────────────
const BANKS = [
  { id: "sbi",   name: "SBI",   color: "#1B3FA0", abbr: "SBI"  },
  { id: "hdfc",  name: "HDFC",  color: "#E31837", abbr: "HDFC" },
  { id: "icici", name: "ICICI", color: "#F58220", abbr: "ICICI"},
  { id: "axis",  name: "Axis",  color: "#800000", abbr: "AXIS" },
  { id: "kotak", name: "Kotak", color: "#EE3124", abbr: "KMB"  },
  { id: "pnb",   name: "PNB",   color: "#1B5E20", abbr: "PNB"  },
];

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
function UpiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="3" stroke="#0F5F56" strokeWidth="1.6"/>
      <path d="M9 8l3 3-3 3M15 8l-3 3 3 3" stroke="#7CCF5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="18.5" r="0.8" fill="#0F5F56"/>
    </svg>
  );
}

function CardIcon({ star }: { star?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#0F5F56" strokeWidth="1.6"/>
      <path d="M2 9h20" stroke="#0F5F56" strokeWidth="1.6"/>
      <rect x="5" y="12" width="5" height="2.5" rx="1" fill="#7CCF5C"/>
      {star && <path d="M17.5 11l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" fill="#F59E0B"/>}
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M3 10h18M5 10V21M19 10V21M12 3L3 10h18L12 3z" stroke="#0F5F56" strokeWidth="1.6" strokeLinejoin="round"/>
      <rect x="8" y="14" width="3" height="7" fill="#7CCF5C"/>
      <rect x="13" y="14" width="3" height="7" fill="#7CCF5C"/>
    </svg>
  );
}

function LockIcon({ color = "#7CCF5C" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="2" stroke={color} strokeWidth="1.4"/>
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" fill="#7CCF5C" fillOpacity="0.18"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#0F5F56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Card type detection ───────────────────────────────────────────────────────
function detectCardType(num: string): string {
  if (num.startsWith("4")) return "visa";
  if (["51","52","53","54","55"].some(p => num.startsWith(p))) return "mastercard";
  if (num.startsWith("6")) return "rupay";
  return "";
}

function CardTypeBadge({ type }: { type: string }) {
  if (!type) return null;
  const labels: Record<string, string> = { visa: "VISA", mastercard: "MC", rupay: "RuPay" };
  const colors: Record<string, string> = { visa: "#1A1F71", mastercard: "#EB001B", rupay: "#0F5F56" };
  return (
    <span style={{
      display: "inline-block",
      background: colors[type] || "#888",
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      borderRadius: 4,
      padding: "2px 6px",
      letterSpacing: 1,
      marginLeft: 6,
      verticalAlign: "middle",
    }}>{labels[type]}</span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{
      width: 56, height: 56,
      border: "4px solid #E5E7EB",
      borderTop: "4px solid #0F5F56",
      borderRadius: "50%",
      animation: "spin 0.9s linear infinite",
    }} />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UpgradePage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [processing, setProcessing] = useState(false);
  const [txnId] = useState("TXN" + Math.floor(1000000000 + Math.random() * 9000000000));

  // Auto-format card number: XXXX XXXX XXXX XXXX
  function handleCardNumber(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  }

  // Auto-format expiry: MM/YY
  function handleExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) {
      setExpiry(digits.slice(0, 2) + "/" + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  }

  function handlePay() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
    }, 2000);
  }

  function handleGoToDashboard() {
    const u = getUser();
    if (u) {
      const upgraded = { ...u, plan: "pro" as const };
      localStorage.setItem("subspace_user", JSON.stringify(upgraded));
    }
    router.push("/dashboard");
  }

  const paymentMethods = [
    { id: "upi" as PaymentMethod,        icon: <UpiIcon />,          label: "UPI",          sub: "PhonePe, GPay, Paytm & more" },
    { id: "debit" as PaymentMethod,      icon: <CardIcon />,         label: "Debit Card",   sub: "Visa, Mastercard, RuPay" },
    { id: "credit" as PaymentMethod,     icon: <CardIcon star />,    label: "Credit Card",  sub: "Visa, Mastercard, Amex" },
    { id: "netbanking" as PaymentMethod, icon: <BankIcon />,         label: "Net Banking",  sub: "All major banks" },
  ];

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(124,207,92,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(124,207,92,0); }
          100% { box-shadow: 0 0 0 0 rgba(124,207,92,0); }
        }
        .pay-method-card { transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; cursor: pointer; }
        .pay-method-card:hover { border-color: #0F5F56 !important; background: #F0FAF8 !important; }
        .pay-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          font-size: 15px;
          font-family: 'Satoshi','DM Sans',sans-serif;
          color: #121212;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .pay-input:focus { border-color: #0F5F56; box-shadow: 0 0 0 3px rgba(15,95,86,0.1); }
        .bank-card { transition: border-color 0.18s, background 0.18s; cursor: pointer; }
        .bank-card:hover { border-color: #0F5F56 !important; background: #F0FAF8 !important; }
        .pay-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          background: #0F5F56;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Satoshi','DM Sans',sans-serif;
          border: none;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s;
          letter-spacing: 0.3px;
        }
        .pay-btn:hover { background: #0A4840; }
        .pay-btn:active { transform: scale(0.98); }
        .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) {
          .upgrade-layout { flex-direction: column !important; }
          .upgrade-left { width: 100% !important; min-height: unset !important; padding: 28px 20px !important; }
          .upgrade-right { padding: 24px 16px !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Satoshi','DM Sans',sans-serif",
        background: "#F5EFE7",
      }} className="upgrade-layout">

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div className="upgrade-left" style={{
          width: 420,
          minHeight: "100vh",
          background: "#0F2018",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7CCF5C, #0F5F56)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2l2.5 5.5H17l-4.5 3.5 1.7 5.5L9 13l-5.2 3.5 1.7-5.5L1 7.5h5.5z" fill="#fff"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>
              Subspace.money
            </span>
          </div>

          {/* Plan info */}
          <div style={{ marginBottom: 8 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(124,207,92,0.15)",
              color: "#7CCF5C",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 6,
              marginBottom: 14,
            }}>Pro Plan</span>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 32,
              color: "#fff",
              margin: "0 0 6px",
              lineHeight: 1.1,
            }}>Subspace Pro</h1>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 42,
                color: "#fff",
                lineHeight: 1,
              }}>₹190</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>/month</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "28px 0" }} />

          {/* Features */}
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 16 }}>
            What&apos;s included
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {[
              "Unlimited subscriptions",
              "Unlimited savings goals",
              "AI Finance Assistant",
              "Investment tracking",
              "Unlimited groups",
            ].map((feature) => (
              <div key={feature} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckIcon />
                <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 14 }}>{feature}</span>
              </div>
            ))}
          </div>

          {/* Secure badge */}
          <div style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <LockIcon color="#7CCF5C" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Secured by Subspace · 256-bit SSL</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
        <div className="upgrade-right" style={{
          flex: 1,
          background: "#F5EFE7",
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}>

          {/* Amount pill (top right) */}
          <div style={{
            position: "absolute",
            top: 28, right: 40,
            background: "#fff",
            border: "1.5px solid #E5E0D5",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 700,
            color: "#0F5F56",
          }}>₹190/month</div>

          {/* Progress indicator */}
          {step < 3 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: s === step ? 28 : 24,
                    height: s === step ? 28 : 24,
                    borderRadius: "50%",
                    background: s < step ? "#0F5F56" : s === step ? "#0F5F56" : "#E5E0D5",
                    color: s <= step ? "#fff" : "#9CA3AF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    transition: "all 0.2s",
                    boxShadow: s === step ? "0 0 0 4px rgba(15,95,86,0.15)" : "none",
                  }}>
                    {s < step ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : s}
                  </div>
                  {s < 3 && (
                    <div style={{
                      width: 32, height: 2,
                      background: s < step ? "#0F5F56" : "#E5E0D5",
                      borderRadius: 2,
                      transition: "background 0.3s",
                    }} />
                  )}
                </div>
              ))}
              <span style={{ marginLeft: 4, fontSize: 12, color: "#9CA3AF" }}>
                {step === 1 ? "Choose method" : step === 2 ? "Enter details" : "Processing"}
              </span>
            </div>
          )}

          {/* ── STEP 1: Choose Payment Method ──────────────────────────── */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.3s ease both" }}>
              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 28,
                color: "#121212",
                margin: "0 0 6px",
                letterSpacing: "-0.5px",
              }}>Complete your payment</h2>
              <p style={{ color: "#6B6B6B", fontSize: 14, margin: "0 0 32px" }}>
                Choose how you&apos;d like to pay
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="pay-method-card"
                    onClick={() => setMethod(pm.id)}
                    role="radio"
                    aria-checked={method === pm.id}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setMethod(pm.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      borderRadius: 16,
                      border: method === pm.id ? "2px solid #0F5F56" : "2px solid #E5E0D5",
                      background: method === pm.id ? "#F0FAF8" : "#fff",
                      boxShadow: method === pm.id ? "0 0 0 3px rgba(15,95,86,0.08)" : "none",
                    }}
                  >
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: 12,
                      background: method === pm.id ? "rgba(15,95,86,0.08)" : "#F5EFE7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {pm.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#121212" }}>{pm.label}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{pm.sub}</div>
                    </div>
                    <div style={{
                      width: 20, height: 20,
                      borderRadius: "50%",
                      border: method === pm.id ? "6px solid #0F5F56" : "2px solid #D1D5DB",
                      transition: "all 0.18s",
                    }} />
                  </div>
                ))}
              </div>

              <button
                id="payment-method-continue-btn"
                className="pay-btn"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 24 }}>
                {["256-bit SSL", "PCI DSS Compliant", "Secure Payment"].map((badge) => (
                  <div key={badge} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <LockIcon color="#9CA3AF" />
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Payment Details ────────────────────────────────── */}
          {step === 2 && !processing && (
            <div style={{ animation: "fadeUp 0.3s ease both" }}>
              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none", cursor: "pointer",
                  color: "#6B6B6B", fontSize: 13, fontWeight: 600,
                  padding: "0 0 24px",
                  fontFamily: "'Satoshi','DM Sans',sans-serif",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="#6B6B6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>

              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 26,
                color: "#121212",
                margin: "0 0 24px",
                letterSpacing: "-0.4px",
              }}>
                {method === "upi" && "Pay via UPI"}
                {method === "debit" && "Debit Card Details"}
                {method === "credit" && "Credit Card Details"}
                {method === "netbanking" && "Select your bank"}
              </h2>

              {/* UPI */}
              {method === "upi" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                      UPI ID
                    </label>
                    <input
                      id="upi-id-input"
                      className="pay-input"
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>
                      Supported: PhonePe, Google Pay, Paytm, BHIM & more
                    </p>
                  </div>
                  <button
                    id="upi-verify-pay-btn"
                    className="pay-btn"
                    disabled={!upiId.includes("@")}
                    onClick={handlePay}
                    style={{ marginTop: 8 }}
                  >
                    Verify &amp; Pay ₹190
                  </button>
                </div>
              )}

              {/* Debit / Credit Card */}
              {(method === "debit" || method === "credit") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                      Card Number
                      {cardNumber && <CardTypeBadge type={detectCardType(cardNumber.replace(/\s/g, ""))} />}
                    </label>
                    <input
                      id="card-number-input"
                      className="pay-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => handleCardNumber(e.target.value)}
                      maxLength={19}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                        Expiry
                      </label>
                      <input
                        id="card-expiry-input"
                        className="pay-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => handleExpiry(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                        CVV
                      </label>
                      <input
                        id="card-cvv-input"
                        className="pay-input"
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                      Cardholder Name
                    </label>
                    <input
                      id="cardholder-name-input"
                      className="pay-input"
                      type="text"
                      placeholder="Name on card"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>
                  <button
                    id="card-pay-btn"
                    className="pay-btn"
                    disabled={cardNumber.replace(/\s/g, "").length < 16 || expiry.length < 5 || cvv.length < 3 || !cardHolder.trim()}
                    onClick={handlePay}
                    style={{ marginTop: 4 }}
                  >
                    Pay ₹190
                  </button>
                </div>
              )}

              {/* Net Banking */}
              {method === "netbanking" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {BANKS.map((bank) => (
                      <div
                        key={bank.id}
                        className="bank-card"
                        onClick={() => setSelectedBank(bank.id)}
                        role="radio"
                        aria-checked={selectedBank === bank.id}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedBank(bank.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          padding: "16px 8px",
                          borderRadius: 14,
                          border: selectedBank === bank.id ? `2px solid ${bank.color}` : "2px solid #E5E0D5",
                          background: selectedBank === bank.id ? bank.color + "10" : "#fff",
                          userSelect: "none",
                        }}
                      >
                        <div style={{
                          width: 40, height: 40,
                          borderRadius: 10,
                          background: bank.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: 0.5,
                        }}>{bank.abbr}</div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{bank.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    id="netbanking-proceed-btn"
                    className="pay-btn"
                    disabled={!selectedBank}
                    onClick={handlePay}
                    style={{ marginTop: 4 }}
                  >
                    Proceed to Bank →
                  </button>
                </div>
              )}

              {/* Trust badges */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 28 }}>
                {["256-bit SSL", "PCI DSS Compliant", "Secure Payment"].map((badge) => (
                  <div key={badge} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <LockIcon color="#9CA3AF" />
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 → Processing state ──────────────────────────────── */}
          {step === 2 && processing && (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              animation: "fadeUp 0.3s ease both",
            }}>
              <Spinner />
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 22,
                  color: "#121212",
                  margin: "0 0 6px",
                }}>Processing payment...</p>
                <p style={{ color: "#9CA3AF", fontSize: 13 }}>Please do not close this window</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ────────────────────────────────────────── */}
          {step === 3 && (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              animation: "fadeUp 0.4s ease both",
              textAlign: "center",
            }}>
              {/* Animated checkmark circle */}
              <div style={{
                width: 80, height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7CCF5C, #0F5F56)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24,
                animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both, pulse-ring 1.5s 0.5s ease-out",
                boxShadow: "0 8px 32px rgba(124,207,92,0.35)",
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M8 18l7 7 13-13" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 30,
                color: "#121212",
                margin: "0 0 8px",
                letterSpacing: "-0.5px",
              }}>Payment Successful!</h2>

              <p style={{ color: "#0F5F56", fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>
                ₹190 paid for Subspace Pro
              </p>

              <p style={{ color: "#9CA3AF", fontSize: 13, margin: "0 0 24px" }}>
                Transaction ID: <span style={{ fontWeight: 700, color: "#6B6B6B", fontFamily: "monospace" }}>{txnId}</span>
              </p>

              <div style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 28px",
                border: "1.5px solid #E5E0D5",
                marginBottom: 28,
                width: "100%",
                maxWidth: 360,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#7CCF5C",
                    boxShadow: "0 0 0 4px rgba(124,207,92,0.2)",
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1A3C2A" }}>
                    Your account has been upgraded to Pro
                  </span>
                </div>
              </div>

              <button
                id="go-to-dashboard-btn"
                className="pay-btn"
                style={{ maxWidth: 360 }}
                onClick={handleGoToDashboard}
              >
                Go to Dashboard →
              </button>
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: "auto",
            paddingTop: 32,
            textAlign: "center",
            color: "#C0BAB0",
            fontSize: 12,
          }}>
            Secured by <strong style={{ color: "#9CA3AF" }}>Subspace Payment Gateway</strong>
          </div>
        </div>
      </div>
    </>
  );
}
