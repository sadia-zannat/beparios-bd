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
import { expenses } from "@/lib/demo-data";
import { formatBDT, formatDate } from "@/lib/format";

export const Route = createFileRoute("/dashboard/expenses")({
  head: () => ({ meta: [{ title: "Expenses — ShopPilot BD" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Ad spend, courier, packaging and other business costs."
        action={
          <Button><Plus className="mr-1 h-4 w-4" /> Add expense</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="This month" value={formatBDT(total)} hint={`${expenses.length} entries`} />
        <SummaryCard label="Facebook / Instagram ads" value={formatBDT(11700)} hint="Highest category" />
        <SummaryCard label="Courier fees" value={formatBDT(6200)} hint="Pathao + Steadfast" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{e.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatBDT(e.amount)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(e.date)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.note ?? "—"}</TableCell>
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

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
