"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#F5EFE7" }}
    >
      {/* Left: Branding */}
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

        <div>
          <blockquote>
            <p
              style={{ fontFamily: "'Instrument Serif', serif" }}
              className="text-[28px] text-white leading-snug tracking-tight mb-6"
            >
              &ldquo;I had no idea I was spending &#8377;4,800 a month on subscriptions I barely used. Subspace found it in two minutes.&rdquo;
            </p>
            <footer className="text-[14px] text-white/50">
              Arjun M. — Software engineer, Bengaluru
            </footer>
          </blockquote>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex">
            {["A","R","S","K","P"].map((init, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: ["#1F5C4A","#2A6B58","#3D7A6A","#4A8878","#2A5248"][i],
                  borderColor: "#0F5F56",
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: 5 - i,
                  position: "relative",
                }}
                aria-hidden="true"
              >
                {init}
              </div>
            ))}
          </div>
          <p className="text-[13px] text-white/60">100+ users tracking their finances</p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
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
            Welcome back
          </h1>
          <p className="text-[15px] text-[#6B6B6B] mb-8">
            Sign in to continue to your dashboard.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/dashboard";
            }}
            className="space-y-4"
            aria-label="Login form"
          >
            <div>
              <label
                htmlFor="login-email"
                className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1.5"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                defaultValue="demo@subspace.money"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#121212] outline-none focus:border-[#0F5F56] focus:ring-2 focus:ring-[#0F5F56]/15 transition-all placeholder:text-[#9CA3AF]"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#0F5F56] hover:text-[#083B35] transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                required
                placeholder="Enter your password"
                defaultValue="demo1234"
                className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#121212] outline-none focus:border-[#0F5F56] focus:ring-2 focus:ring-[#0F5F56]/15 transition-all placeholder:text-[#9CA3AF]"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F5F56] text-white text-[14px] font-semibold rounded-full py-3.5 hover:bg-[#083B35] transition-all duration-200 mt-2"
              style={{ boxShadow: "0 4px 12px rgba(15,95,86,0.3)" }}
            >
              Sign in
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#F5EFE7] text-[12px] text-[#9CA3AF]">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full bg-white border border-[#E5E7EB] text-[14px] font-semibold text-[#121212] rounded-full py-3 hover:bg-[#F5EFE7] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M17.64 9.2c0-.638-.057-1.252-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-[13px] text-[#9CA3AF] mt-6">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-[#0F5F56] hover:text-[#083B35] no-underline transition-colors">
              Start for free
            </Link>
          </p>

          {/* Demo note */}
          <div className="mt-6 p-3 bg-[#7CCF5C]/10 border border-[#7CCF5C]/20 rounded-xl text-center">
            <p className="text-[12px] text-[#5CB840] font-semibold">
              Demo mode — click Sign in to explore the dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
