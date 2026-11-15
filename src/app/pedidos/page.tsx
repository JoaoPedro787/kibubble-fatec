import { AuthenticatedShell } from "@/shared/layouts/authenticated-shell";
import { OrdersBoardView } from "@/pedidos/components/orders-board-view";

export default function PedidosPage() {
  return (
    <AuthenticatedShell>
      <OrdersBoardView />
    </AuthenticatedShell>
  );
}
