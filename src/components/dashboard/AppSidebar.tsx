import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Receipt,
  Settings,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingBag },
  { title: "Products", url: "/dashboard/products", icon: Boxes },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Expenses", url: "/dashboard/expenses", icon: Wallet },
  { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
];

const bottomItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-12 items-center px-2 group-data-[collapsible=icon]:justify-center">
          <Logo className="group-data-[collapsible=icon]:hidden" />
          <span className="hidden h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground group-data-[collapsible=icon]:grid">
            <Receipt className="h-4 w-4" />
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.exact)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
