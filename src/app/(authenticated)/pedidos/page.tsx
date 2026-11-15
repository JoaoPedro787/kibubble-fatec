import { PageTransition } from "@/shared/components/page-transition";
import { OrdersBoardView } from "@/pedidos/components/orders-board-view";

export default function PedidosPage() {
  return (
    <PageTransition>
      <OrdersBoardView />
    </PageTransition>
  );
}
