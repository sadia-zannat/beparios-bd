import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Calculator,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Store,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { formatBDT } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "BepariOS BD — Free Seller Tools",
      },
      {
        name: "description",
        content:
          "Free COD profit, pricing, ads break-even, return loss and invoice tools for Bangladeshi online sellers.",
      },
      {
        property: "og:title",
        content: "BepariOS BD — Free Seller Tools",
      },
      {
        property: "og:description",
        content:
          "Free COD profit, pricing, ads break-even, return loss and invoice tools for Bangladeshi online sellers.",
      },
      { property: "og:url", content: "https://bepariosbd.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://bepariosbd.lovable.app/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <BuiltFor />
      <CTA />
      <LandingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_18%,transparent)_0%,transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <Badge
            variant="secondary"
            className="mb-5 rounded-full border border-border/60 px-3 py-1 text-xs font-medium"
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Built for Bangladesh's online sellers
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Free seller tools for{" "}
            <span className="text-primary">Bangladesh's online sellers.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            BepariOS BD gives every Bangladeshi seller free calculators and
            invoice tools — plus a private dashboard to manage orders,
            inventory, expenses and profit in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/tools">
                Use Free Seller Tools <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">View Dashboard Demo</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              "Free calculators & invoice tools",
              "Bangla-friendly, BDT native",
              "No sign-up to try the tools",
            ].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  const stats = [
    { label: "Today's sales", value: formatBDT(18450), delta: "+12%" },
    { label: "Pending COD", value: formatBDT(46200), delta: "14 orders" },
    { label: "Net profit", value: formatBDT(6820), delta: "+8%" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
      <Card className="overflow-hidden border-border/70 shadow-xl">
        <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          </div>
          <span className="text-xs text-muted-foreground">
            beparios.bd/dashboard
          </span>
        </div>
        <CardContent className="space-y-5 p-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-muted/40 p-3"
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-lg font-bold">{s.value}</p>
                <p className="text-xs text-primary">{s.delta}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Recent orders</p>
              <span className="text-xs text-muted-foreground">Demo</span>
            </div>
            <ul className="divide-y divide-border text-sm">
              {[
                ["Rifat Hasan", "Cotton Panjabi", "1,850", "COD"],
                ["Nusrat Jahan", "Georgette 3pc", "2,650", "bKash"],
                ["Sabrina Akter", "Jute Bag ×3", "1,650", "Nagad"],
              ].map(([name, prod, amt, pay]) => (
                <li
                  key={name}
                  className="grid grid-cols-[1fr_auto] items-center gap-2 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {prod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">৳{amt}</p>
                    <p className="text-[11px] text-muted-foreground">{pay}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const features = [
  {
    icon: Calculator,
    title: "Free seller calculators",
    desc: "COD profit, product pricing, ad break-even and return-loss calculators — free for every seller.",
  },
  {
    icon: ClipboardList,
    title: "Order management",
    desc: "Capture every order from Messenger, Instagram or your form in one place with clear status tracking.",
  },
  {
    icon: Boxes,
    title: "Products & stock",
    desc: "Real-time stock levels with low-stock alerts so you never oversell a product on Facebook Live again.",
  },
  {
    icon: Truck,
    title: "COD & courier ready",
    desc: "Track pending Cash on Delivery, courier status and returned parcels in Taka — no spreadsheets needed.",
  },
  {
    icon: Wallet,
    title: "Expenses & profit",
    desc: "Log ad spend, courier bills, packaging and salary — see your real net profit for every month.",
  },
  {
    icon: Users,
    title: "Customer directory",
    desc: "Every buyer with phone, address and order history. Spot repeat customers and reward loyalty.",
  },
  {
    icon: BarChart3,
    title: "Reports that make sense",
    desc: "Simple charts for sales, best-selling products and profit trends — designed for shop owners, not accountants.",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Free tools + a private business dashboard
          </h2>
          <p className="mt-3 text-muted-foreground">
            Use the calculators for free, or sign in to run your whole shop.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="border-border/70 transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Try the free tools",
      desc: "Use the COD, pricing and ad break-even calculators — no sign-up needed.",
    },
    {
      n: 2,
      title: "Add your products",
      desc: "Upload your catalogue with price, cost and stock in the dashboard.",
    },
    {
      n: 3,
      title: "Log orders & courier",
      desc: "Track every Messenger, Instagram or Live order and mark courier status.",
    },
    {
      n: 4,
      title: "See real profit",
      desc: "Deduct ad spend, courier and packaging automatically to see net profit.",
    },
  ];
  return (
    <section id="how" className="border-y border-border bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            From chaos to clarity in 4 steps
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-xl border border-border bg-card p-6"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Free Tools",
    price: 0,
    tag: "Available now",
    desc: "Free calculators and invoice generator for every seller.",
    features: [
      "COD Profit Calculator",
      "Product Pricing Calculator",
      "Ads Break-even Calculator",
      "Return Loss Calculator",
      "Free Invoice Generator",
    ],
    cta: "Use free tools",
    ctaTo: "/tools" as const,
    highlight: false,
    available: true,
  },
  {
    name: "Growth",
    price: 999,
    tag: "Coming later",
    desc: "Planned plan for shops doing 200+ orders a month.",
    features: [
      "Unlimited orders",
      "Unlimited products",
      "Expenses & profit reports",
      "Low-stock alerts",
      "3 team members",
    ],
    cta: "Preview dashboard",
    ctaTo: "/dashboard" as const,
    highlight: true,
    available: false,
  },
  {
    name: "Business",
    price: 2499,
    tag: "Coming later",
    desc: "Planned plan for established brands with multiple channels.",
    features: [
      "Everything in Growth",
      "Invoice branding",
      "Courier API ready",
      "Priority Bangla support",
      "10 team members",
    ],
    cta: "Preview dashboard",
    ctaTo: "/dashboard" as const,
    highlight: false,
    available: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Planned Pricing
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Free tools today. Paid plans coming later.
          </h2>
          <p className="mt-3 text-muted-foreground">
            The calculators and invoice generator are free. Paid plans below are
            planned and not yet available for purchase.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={`relative border-border/70 ${p.highlight ? "border-primary shadow-lg ring-1 ring-primary/30" : ""}`}
            >
              <span
                className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold ${
                  p.available
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {p.tag}
              </span>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {p.price === 0 ? "৳0" : formatBDT(p.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {p.price === 0 ? "" : "/month (planned)"}
                  </span>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={p.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link to={p.ctaTo}>{p.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const builtForItems = [
  { title: "Facebook page sellers", desc: "Turn Messenger orders into a tidy pipeline." },
  { title: "Instagram sellers", desc: "Track DM orders, stock and profit in one place." },
  { title: "Boutique businesses", desc: "Manage 3-pieces, sarees and seasonal drops." },
  { title: "Home-food businesses", desc: "Plan daily orders and ingredient costs." },
  { title: "Cosmetics sellers", desc: "Track batches, expiry and re-order stock." },
  { title: "Handmade product sellers", desc: "Price custom items with real material cost." },
];

function BuiltFor() {
  return (
    <section
      id="built-for"
      className="border-y border-border bg-muted/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Built for
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Made for Bangladesh's online sellers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Whether you sell on a Facebook page, Instagram, or from home —
            BepariOS BD is built for you.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {builtForItems.map((b) => (
            <Card key={b.title} className="border-border/70">
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Store className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-14">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Start with the free seller tools
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            No sign-up needed to use the calculators and invoice generator. Or
            preview the full dashboard with demo data.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/tools">
                Use Free Seller Tools <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">View Dashboard Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
