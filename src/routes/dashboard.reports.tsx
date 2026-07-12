import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { salesOverview, products } from "@/lib/demo-data";
import { formatBDT } from "@/lib/format";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — ShopPilot BD" }] }),
  component: ReportsPage,
});

const categoryColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function ReportsPage() {
  const byCategory = Object.entries(
    products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + p.sold * p.price;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Trends, category breakdown and profitability at a glance."
      />

      <Card>
        <CardHeader>
          <CardTitle>Monthly sales vs profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesOverview}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatBDT(Number(v), { compact: true })} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => formatBDT(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sales" name="Sales" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatBDT(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top products by revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[...products]
                .sort((a, b) => b.sold * b.price - a.sold * a.price)
                .slice(0, 6)
                .map((p) => {
                  const rev = p.sold * p.price;
                  const max = Math.max(...products.map((x) => x.sold * x.price));
                  return (
                    <li key={p.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground">{formatBDT(rev)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(rev / max) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
