import { AuthenticatedShell } from "@/shared/layouts/authenticated-shell";
import { ReportsDashboardView } from "@/relatorios/components/reports-dashboard-view";

export default function RelatoriosPage() {
  return (
    <AuthenticatedShell>
      <ReportsDashboardView />
    </AuthenticatedShell>
  );
}
