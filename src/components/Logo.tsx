import { Link } from "@tanstack/react-router";
import { Package } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Package className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        ShopPilot <span className="text-primary">BD</span>
      </span>
    </Link>
  );
}
