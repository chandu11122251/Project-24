import AppFrame from "@/components/layout/AppFrame";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppFrame>{children}</AppFrame>;
}
