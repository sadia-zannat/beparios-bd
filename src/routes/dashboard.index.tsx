import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Clock,
  Package,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  dashboardStats,
  orders,
  products,
  salesOverview,
} from "@/lib/demo-data";
import { formatBDT, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Overview — ShopPilot BD" }] }),
  component: DashboardOverview,
});

function DashboardOverview() {
  const recent = orders.slice(0, 5);
  const lowStock = products.filter((p) => p.stock <= p.lowStockAt);
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Farzana 👋"
        description="Here's what's happening in your shop today."
        action={
          <Button asChild>
            <Link to="/dashboard/orders">Add order</Link>
          </Button>
        }
      />

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Sales overview</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Last 12 months (BDT)
              </p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> +18% YoY
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesOverview}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => formatBDT(Number(v), { compact: true })}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => formatBDT(v)}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#sales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" /> Low stock
                alerts
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/products">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {lowStock.length === 0 ? (
              <EmptyState
                icon={Boxes}
                title="You're all stocked up"
                description="No products below their low-stock threshold."
              />
            ) : (
              <ul className="divide-y divide-border">
                {lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        SKU {p.sku}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-warning/40 bg-warning/10 text-warning-foreground"
                    >
                      {p.stock} left
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/orders">See all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{o.customer}</div>
                        <div className="text-xs text-muted-foreground">
                          {o.phone}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {o.product}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatBDT(o.amount)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={o.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-selling products</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {bestSellers.map((p, idx) => (
                <li
                  key={p.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(p.sold)} sold · {formatBDT(p.price)}
                    </p>
                  </div>
                  <Badge variant="secondary">{p.category}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsGrid() {
  const items = [
    {
      label: "Total Sales",
      value: formatBDT(dashboardStats.totalSales),
      delta: "+12.4%",
      up: true,
      icon: TrendingUp,
      hint: "This month",
    },
    {
      label: "Net Profit",
      value: formatBDT(dashboardStats.netProfit),
      delta: "+8.2%",
      up: true,
      icon: Wallet,
      hint: "This month",
    },
    {
      label: "Pending Orders",
      value: formatNumber(dashboardStats.pendingOrders),
      delta: "3 urgent",
      up: false,
      icon: Clock,
      hint: "Waiting to ship",
    },
    {
      label: "Pending COD",
      value: formatBDT(dashboardStats.pendingCOD),
      delta: "9 parcels",
      up: false,
      icon: Package,
      hint: "On courier",
    },
    {
      label: "Low Stock Products",
      value: formatNumber(dashboardStats.lowStock),
      delta: "Restock soon",
      up: false,
      icon: AlertTriangle,
      hint: "Below threshold",
    },
    {
      label: "Total Customers",
      value: formatNumber(dashboardStats.totalCustomers),
      delta: "+42 new",
      up: true,
      icon: Users,
      hint: "All time",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((s) => (
        <Card key={s.label} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {s.label}
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-xl font-bold">{s.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs">
              {s.up ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-success" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-warning" />
              )}
              <span
                className={s.up ? "text-success" : "text-muted-foreground"}
              >
                {s.delta}
              </span>
              <span className="text-muted-foreground">· {s.hint}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    processing: "bg-chart-2/15 text-foreground border-chart-2/30",
    shipped: "bg-primary/15 text-primary border-primary/30",
    delivered: "bg-success/15 text-success-foreground border-success/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
    returned: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge
      variant="outline"
      className={`capitalize ${map[status] ?? ""}`}
    >
      {status}
    </Badge>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Boxes;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
