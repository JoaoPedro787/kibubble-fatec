"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Pencil } from "lucide-react";
import {
  getLowStockIngredients,
  isLowStock,
  updateIngredientQuantity,
} from "@/estoque/services/inventory-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import { formatDateTimeBR } from "@/shared/libs/formatters";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/libs/cn";
import type { Ingredient } from "@/shared/types/domain";

export function InventoryView() {
  const { store } = useAppStore();
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  const [quantityInput, setQuantityInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const lowStockList = useMemo(
    () => getLowStockIngredients(store.ingredients),
    [store.ingredients],
  );

  const visibleIngredients = useMemo(() => {
    if (!onlyLowStock) return store.ingredients;
    return lowStockList;
  }, [store.ingredients, lowStockList, onlyLowStock]);

  function openEditDialog(ingredient: Ingredient) {
    setEditingIngredient(ingredient);
    setQuantityInput(String(ingredient.quantity));
    setValidationError(null);
    setSuccessMessage(null);
  }

  function handleSaveQuantity(event: React.FormEvent) {
    event.preventDefault();
    if (!editingIngredient) return;

    const result = updateIngredientQuantity(
      editingIngredient.id,
      quantityInput,
    );

    if (!result.ok) {
      setValidationError(result.message);
      return;
    }

    setSuccessMessage(
      `Quantidade de "${result.ingredient.name}" atualizada para ${result.ingredient.quantity} ${result.ingredient.unit}.`,
    );
    setEditingIngredient(null);
    setValidationError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Estoque de Ingredientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitore quantidades disponíveis, limites mínimos e reabasteça insumos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={!onlyLowStock ? "default" : "outline"}
            size="sm"
            className="cursor-pointer font-mono tabular-nums"
            onClick={() => setOnlyLowStock(false)}
          >
            Todos ({store.ingredients.length})
          </Button>
          <Button
            type="button"
            variant={onlyLowStock ? "default" : "outline"}
            size="sm"
            className="cursor-pointer font-mono tabular-nums"
            onClick={() => setOnlyLowStock(true)}
          >
            Estoque baixo ({lowStockList.length})
          </Button>
        </div>
      </div>

      {lowStockList.length > 0 ? (
        <div
          role="region"
          aria-label="Alertas de estoque baixo"
          className="rounded-lg border-2 border-foreground bg-muted/50 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <AlertTriangle className="size-4" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {lowStockList.length}{" "}
                {lowStockList.length === 1
                  ? "ingrediente atingiu o limite mínimo"
                  : "ingredientes atingiram o limite mínimo"}
              </p>
              <p className="text-xs text-muted-foreground">
                Reabasteça:{" "}
                {lowStockList
                  .map(
                    (ing) =>
                      `${ing.name} (${ing.quantity} ${ing.unit} / mín. ${ing.minThreshold} ${ing.unit})`,
                  )
                  .join("; ")}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      <Card className="border-border shadow-none">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base font-semibold">
            Insumos cadastrados
          </CardTitle>
          <CardDescription className="text-xs">
            As vendas no PDV deduzem ingredientes automaticamente e atualizam os alertas abaixo.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {visibleIngredients.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhum ingrediente com estoque baixo no momento.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Atualização
                  </TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleIngredients.map((ingredient) => {
                  const low = isLowStock(ingredient);
                  return (
                    <TableRow
                      key={ingredient.id}
                      className={cn(low ? "bg-muted/50" : undefined)}
                    >
                      <TableCell className="font-medium">
                        {ingredient.name}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums font-semibold">
                        {ingredient.quantity} {ingredient.unit}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                        {ingredient.minThreshold} {ingredient.unit}
                      </TableCell>
                      <TableCell>
                        {low ? (
                          <Badge variant="default" className="gap-1 text-xs">
                            <AlertTriangle className="size-3" aria-hidden="true" />
                            <span>Estoque baixo</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground tabular-nums">
                        {formatDateTimeBR(ingredient.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => openEditDialog(ingredient)}
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                          <span>Atualizar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={editingIngredient !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingIngredient(null);
            setValidationError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar estoque</DialogTitle>
            <DialogDescription>
              {editingIngredient
                ? `${editingIngredient.name} (limite mínimo: ${editingIngredient.minThreshold} ${editingIngredient.unit})`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveQuantity} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient-quantity-input">
                Nova quantidade ({editingIngredient?.unit})
              </Label>
              <Input
                id="ingredient-quantity-input"
                type="text"
                inputMode="decimal"
                value={quantityInput}
                onChange={(e) => {
                  setQuantityInput(e.target.value);
                  setValidationError(null);
                }}
                aria-invalid={validationError !== null}
              />
              {validationError ? (
                <p role="alert" className="text-xs font-medium text-foreground">
                  {validationError}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setEditingIngredient(null);
                  setValidationError(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="cursor-pointer">
                Salvar quantidade
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
