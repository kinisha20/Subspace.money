import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Create your Subspace.money account and take control of your finances.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "#F5EFE7" }}>

      {/* Left: Branding with feature highlights */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12"
        style={{ background: "#0F5F56" }}
      >
        <Link
          href="/"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-[20px] text-white no-underline"
        >
          Subspace.money
        </Link>

        <div className="space-y-5">
          <h2
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[30px] text-white leading-snug tracking-tight"
          >
            Your finances,<br />finally under control.
          </h2>
          <p className="text-[15px] text-white/60 leading-relaxed">
            Join 100+ users who have already stopped losing money to forgotten subscriptions and disorganized finances.
          </p>

          {[
            { title: "Track every subscription",    desc: "Never pay for something you forgot about."       },
            { title: "AI insights that save money",  desc: "Get recommendations tailored to your spending."  },
            { title: "Split bills without awkwardness", desc: "Group finance that just works."              },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#7CCF5C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 5l2 2 4-4" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">{f.title}</p>
                <p className="text-[12px] text-white/50 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] text-white/30">Free to start. No credit card required.</p>
      </div>

      {/* Right: Signup form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">

          <Link
            href="/"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[20px] text-[#0F5F56] no-underline mb-8 block lg:hidden"
          >
            Subspace.money
          </Link>

          <h1
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[32px] text-[#121212] tracking-tight mb-2"
          >
            Start for free
          </h1>
          <p className="text-[15px] text-[#6B6B6B] mb-8">
            Takes less than 60 seconds. No credit card needed.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
            className="space-y-4"
            aria-label="Signup form"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="fname" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">First name</label>
                <input
                  id="fname"
                  type="text"
                  required
                  placeholder="Aryan"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#121212] outline-none focus:border-[#0F5F56] focus:ring-2 focus:ring-[#0F5F56]/15 transition-all placeholder:text-[#9CA3AF]"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="lname" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Last name</label>
                <input
                  id="lname"
                  type="text"
                  required
                  placeholder="Gupta"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#121212] outline-none focus:border-[#0F5F56] focus:ring-2 focus:ring-[#0F5F56]/15 transition-all placeholder:text-[#9CA3AF]"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#121212] outline-none focus:border-[#0F5F56] focus:ring-2 focus:ring-[#0F5F56]/15 transition-all placeholder:text-[#9CA3AF]"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Password</label>
              <input
                id="signup-password"
                type="password"
                required
                placeholder="Min. 8 characters"
                minLength={8}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#121212] outline-none focus:border-[#0F5F56] focus:ring-2 focus:ring-[#0F5F56]/15 transition-all placeholder:text-[#9CA3AF]"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7CCF5C] text-[#121212] text-[14px] font-bold rounded-full py-3.5 hover:bg-[#5CB840] transition-all duration-200 mt-2"
              style={{ boxShadow: "0 4px 12px rgba(124,207,92,0.35)" }}
            >
              Create free account
            </button>
          </form>

          <p className="text-[12px] text-[#9CA3AF] text-center mt-4">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#0F5F56] no-underline hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="text-[#0F5F56] no-underline hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-[13px] text-[#9CA3AF] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#0F5F56] hover:text-[#083B35] no-underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
