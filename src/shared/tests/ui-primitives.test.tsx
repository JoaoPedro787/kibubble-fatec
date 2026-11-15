import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";

describe("shadcn/ui primitives", () => {
  it("renders base primitives cleanly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Ki Bubble</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge>Ativo</Badge>
          <Input aria-label="Quantidade" defaultValue="10" />
          <Button>Confirmar</Button>
        </CardContent>
      </Card>,
    );

    expect(screen.getByText("Ki Bubble")).toBeDefined();
    expect(screen.getByText("Ativo")).toBeDefined();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDefined();
    expect(screen.getByLabelText("Quantidade")).toBeDefined();
  });
});
