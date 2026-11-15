import { AuthenticatedShell } from "@/shared/layouts/authenticated-shell";
import { SalesPosView } from "@/vendas/components/sales-pos-view";

export default function VendasPage() {
  return (
    <AuthenticatedShell>
      <SalesPosView />
    </AuthenticatedShell>
  );
}
