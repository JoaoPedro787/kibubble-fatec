import { PageTransition } from "@/shared/components/page-transition";
import { ReportsDashboardView } from "@/relatorios/components/reports-dashboard-view";

export default function RelatoriosPage() {
  return (
    <PageTransition>
      <ReportsDashboardView />
    </PageTransition>
  );
}
