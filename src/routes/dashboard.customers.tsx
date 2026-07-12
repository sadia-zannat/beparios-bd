import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { customers } from "@/lib/demo-data";
import { formatBDT, formatDate, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/dashboard/customers")({
  head: () => ({ meta: [{ title: "Customers — ShopPilot BD" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Every buyer with contact info and order history."
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total spent</TableHead>
                  <TableHead>Last order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </span>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" /> {c.phone}
                      </span>
                    </TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell className="text-right">{formatNumber(c.orders)}</TableCell>
                    <TableCell className="text-right font-medium">{formatBDT(c.totalSpent)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(c.lastOrder)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
