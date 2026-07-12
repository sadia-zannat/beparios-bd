import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { products } from "@/lib/demo-data";
import { formatBDT, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({ meta: [{ title: "Products — BepariOS BD" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your catalogue, stock levels and pricing."
        action={
          <Button><Plus className="mr-1 h-4 w-4" /> Add product</Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => {
                  const low = p.stock <= p.lowStockAt;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.sku}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatBDT(p.price)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatBDT(p.cost)}</TableCell>
                      <TableCell className="text-right">
                        <span className={low ? "font-semibold text-warning-foreground" : ""}>
                          {p.stock}
                        </span>
                        {low && (
                          <Badge variant="outline" className="ml-2 border-warning/40 bg-warning/10 text-warning-foreground">Low</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(p.sold)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
