import { PageTransition } from "@/shared/components/page-transition";
import { InventoryView } from "@/estoque/components/inventory-view";

export default function EstoquePage() {
  return (
    <PageTransition>
      <InventoryView />
    </PageTransition>
  );
}
