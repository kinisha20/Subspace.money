import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Subspace.money — AI-Powered Finance Management",
    template: "%s | Subspace.money",
  },
  description:
    "Track subscriptions, split bills, automate savings, and manage investments with AI. India's most premium personal finance platform.",
  keywords: [
    "personal finance",
    "subscription tracker",
    "savings goals",
    "AI budgeting",
    "bill splitting",
    "investment tracker",
    "India fintech",
    "money management",
  ],
  authors: [{ name: "Subspace.money" }],
  creator: "Subspace.money",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://subspace.money",
    siteName: "Subspace.money",
    title: "Subspace.money — AI-Powered Finance Management",
    description:
      "India's most premium AI-native subscription and finance management platform.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subspace.money",
    description: "AI-powered finance management for modern India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F5F56",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&f[]=general-sans@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Satoshi', 'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(15,95,86,0.12)",
            },
          }}
        />
      </body>
    </html>
  );
}
