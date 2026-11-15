import { AuthenticatedShell } from "@/shared/layouts/authenticated-shell";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
