import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calculator,
  FileText,
  Megaphone,
  PackageX,
  Tag,
  Truck,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Free Seller Tools — BepariOS BD" },
      {
        name: "description",
        content:
          "Free calculators and an invoice generator for Bangladeshi online sellers — COD profit, product pricing, ad break-even, return loss and more.",
      },
      { property: "og:title", content: "Free Seller Tools — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Free calculators and invoice tools for every Bangladeshi seller.",
      },
    ],
  }),
  component: ToolsPage,
});

type Tool = {
  title: string;
  desc: string;
  icon: LucideIcon;
  to: string;
};

const tools: Tool[] = [
  {
    title: "COD Profit Calculator",
    desc: "See real profit after courier fees, COD charges and returns.",
    icon: Truck,
    to: "/tools/cod-profit",
  },
  {
    title: "Product Pricing Calculator",
    desc: "Set a selling price using cost, margin and platform fees.",
    icon: Tag,
    to: "/tools/product-pricing",
  },
  {
    title: "Facebook Ads Break-even Calculator",
    desc: "Find the ROAS and CPA you need to stop losing money on ads.",
    icon: Megaphone,
    to: "/tools/ads-breakeven",
  },
  {
    title: "Return Loss Calculator",
    desc: "Estimate how much each return actually costs your shop.",
    icon: PackageX,
    to: "/tools/return-loss",
  },
  {
    title: "Free Invoice Generator",
    desc: "Create clean BDT invoices for your customers in seconds.",
    icon: FileText,
    to: "/tools/invoice",
  },
];

function ToolsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Badge
            variant="secondary"
            className="mb-4 rounded-full border border-border/60 px-3 py-1 text-xs font-medium"
          >
            <Calculator className="mr-2 h-3.5 w-3.5 text-primary" />
            Free Seller Tools
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Free calculators & invoice tools for Bangladeshi sellers
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Simple, no-signup tools to help you price products, plan ads and
            understand your real profit — in Taka.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group block focus:outline-none"
              >
                <Card className="h-full border-border/70 transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">
                  <CardContent className="p-6">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                      <t.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            More tools coming soon. All tools are free to use.
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
