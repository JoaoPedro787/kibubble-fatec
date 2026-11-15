import { AuthenticatedShell } from "@/shared/layouts/authenticated-shell";
import { InventoryView } from "@/estoque/components/inventory-view";

export default function EstoquePage() {
  return (
    <AuthenticatedShell>
      <InventoryView />
    </AuthenticatedShell>
  );
}
