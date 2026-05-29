/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5EFE7",
          50: "#FDFAF6",
          100: "#F5EFE7",
          200: "#EDE8DF",
          300: "#E0D8CC",
        },
        teal: {
          DEFAULT: "#0F5F56",
          50: "#EAF3F1",
          100: "#C5DDD9",
          200: "#8BBFB8",
          300: "#4A9A90",
          400: "#176F64",
          500: "#0F5F56",
          600: "#0B4D45",
          700: "#083B35",
          800: "#052A25",
          900: "#031A17",
        },
        accent: {
          DEFAULT: "#7CCF5C",
          50: "#F0FAE9",
          100: "#D8F2C5",
          200: "#B6E894",
          300: "#8FD96A",
          400: "#7CCF5C",
          500: "#5CB840",
          600: "#429E2B",
          700: "#2D7A1C",
          800: "#1C5611",
          900: "#0E3308",
        },
        subspace: {
          black: "#121212",
          gray: "#6B6B6B",
          "gray-light": "#9CA3AF",
          "gray-line": "#E5E7EB",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "DM Serif Display", "Georgia", "serif"],
        sans: ["Satoshi", "General Sans", "DM Sans", "system-ui", "sans-serif"],
        display: ["Clash Display", "Instrument Serif", "serif"],
      },
      fontSize: {
        "hero": ["clamp(48px, 6vw, 80px)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display": ["clamp(36px, 4.5vw, 60px)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "heading": ["clamp(28px, 3.5vw, 44px)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "subheading": ["clamp(20px, 2.5vw, 28px)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },
      spacing: {
        "section": "100px",
        "section-sm": "64px",
        "card": "32px",
        "card-sm": "20px",
      },
      borderRadius: {
        "card": "20px",
        "card-lg": "28px",
        "card-sm": "12px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-md": "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        "card-lg": "0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
        "card-xl": "0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
        "teal": "0 8px 24px rgba(15,95,86,0.25)",
        "accent": "0 8px 24px rgba(124,207,92,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "float": "float 5.5s ease-in-out infinite",
        "liquid": "liquidRise 3s ease-in-out infinite alternate",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "counter": "counterUp 1s ease-out",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        liquidRise: {
          "0%": { height: "28%" },
          "100%": { height: "70%" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        counterUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "cream-gradient": "linear-gradient(135deg, #F5EFE7 0%, #EDE8DF 100%)",
        "teal-gradient": "linear-gradient(135deg, #176F64 0%, #0F5F56 50%, #083B35 100%)",
        "accent-gradient": "linear-gradient(135deg, #8FD96A 0%, #7CCF5C 50%, #5CB840 100%)",
        "dark-gradient": "linear-gradient(180deg, #0C2018 0%, #0F5F56 100%)",
      },
    },
  },
  plugins: [],
};
