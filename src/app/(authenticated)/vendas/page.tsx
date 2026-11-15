import { PageTransition } from "@/shared/components/page-transition";
import { SalesPosView } from "@/vendas/components/sales-pos-view";

export default function VendasPage() {
  return (
    <PageTransition>
      <SalesPosView />
    </PageTransition>
  );
}
