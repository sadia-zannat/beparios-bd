import { Badge } from "@/components/ui/badge";

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
    <Badge variant="outline" className={`capitalize ${map[status] ?? ""}`}>
      {status}
    </Badge>
  );
}
