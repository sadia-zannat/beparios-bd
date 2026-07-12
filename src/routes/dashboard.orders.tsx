import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { OrderStatusBadge } from "@/routes/dashboard.index";
import { orders } from "@/lib/demo-data";
import { formatBDT, formatDate } from "@/lib/format";

export const Route = createFileRoute("/dashboard/orders")({
  head: () => ({ meta: [{ title: "Orders — ShopPilot BD" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="All orders from Facebook, Instagram and direct channels."
        action={
          <Button>
            <Plus className="mr-1 h-4 w-4" /> New order
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center sm:justify-between">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by order ID, customer or phone…" className="pl-9 sm:w-80" />
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">Pending</Button>
              <Button variant="outline" size="sm" className="hidden md:inline-flex">Shipped</Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{o.customer}</div>
                      <div className="text-xs text-muted-foreground">{o.phone}</div>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">{o.product}</TableCell>
                    <TableCell className="text-right">{o.qty}</TableCell>
                    <TableCell className="text-right font-medium">{formatBDT(o.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{o.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(o.date)}</TableCell>
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
