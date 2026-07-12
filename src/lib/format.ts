export function formatBDT(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 10000000)
      return `৳${(amount / 10000000).toFixed(2)} Cr`;
    if (Math.abs(amount) >= 100000)
      return `৳${(amount / 100000).toFixed(2)} L`;
    if (Math.abs(amount) >= 1000) return `৳${(amount / 1000).toFixed(1)}k`;
  }
  return `৳${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
