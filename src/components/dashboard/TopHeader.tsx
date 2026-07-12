import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Search, Settings, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders, products, customers…"
          className="pl-9"
        />
      </div>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
        <BusinessProfileDropdown />
      </div>
    </header>
  );
}

function BusinessProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card px-1.5 py-1 pr-2 text-sm hover:bg-muted">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            KB
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold leading-none">
              Kotha Boutique
            </span>
            <span className="mt-0.5 block text-[10px] text-muted-foreground">
              Farzana Islam
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Store className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              Kotha Boutique
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              farzana@kotha.shop
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings">
              <User className="mr-2 h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" /> Shop settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between">
            <span className="flex items-center">
              <Store className="mr-2 h-4 w-4" /> Plan
            </span>
            <Badge variant="secondary">Growth</Badge>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/login">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
