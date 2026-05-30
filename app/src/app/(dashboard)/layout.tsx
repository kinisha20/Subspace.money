// Force all dashboard pages to render dynamically (no static generation).
// This prevents the "Event handlers cannot be passed to Client Component props" error
// that occurs when Next.js tries to statically pre-render interactive client components.
export const dynamic = "force-dynamic";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
