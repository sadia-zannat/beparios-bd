import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
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
      { title: "ShopPilot BD — All-in-one dashboard for F-commerce sellers" },
      {
        name: "description",
        content:
          "Run your Facebook & Instagram shop from one dashboard: orders, stock, customers, expenses, invoices and real profit in BDT.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
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
            Built for Bangladeshi F-commerce sellers
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Run your Facebook shop like a{" "}
            <span className="text-primary">real business.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            ShopPilot BD keeps your orders, stock, customers, expenses and
            profit in one clean dashboard — so you stop losing money in
            Messenger chats and Excel sheets.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/signup">
                Start free — 14 days <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how">See how it works</a>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No card required", "Bangla support", "Cancel anytime"].map(
              (i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
                </li>
              ),
            )}
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
            shoppilot.bd/dashboard
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
              <span className="text-xs text-muted-foreground">Live</span>
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

function SocialProof() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-sm text-muted-foreground sm:px-6">
        <span className="font-medium">Trusted by 2,000+ BD sellers on</span>
        <span className="font-semibold text-foreground">Facebook Shops</span>
        <span className="font-semibold text-foreground">Instagram</span>
        <span className="font-semibold text-foreground">Daraz</span>
        <span className="font-semibold text-foreground">WhatsApp Business</span>
      </div>
    </section>
  );
}

const features = [
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
            Everything you need to run your online shop
          </h2>
          <p className="mt-3 text-muted-foreground">
            Purpose-built for Bangladeshi sellers — from your first order to
            your thousandth.
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
      title: "Add your products",
      desc: "Upload your catalogue with price, cost and stock. Takes less than 10 minutes.",
    },
    {
      n: 2,
      title: "Log orders as they come",
      desc: "From every Messenger inbox, Instagram DM or Facebook Live — one click, one order.",
    },
    {
      n: 3,
      title: "Track courier & COD",
      desc: "Mark shipped, delivered or returned. Know exactly how much money is on the road.",
    },
    {
      n: 4,
      title: "See real profit",
      desc: "Deduct ad spend, courier and packaging automatically. Real profit, not vanity revenue.",
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
    name: "Starter",
    price: 0,
    tag: "Free forever",
    desc: "For sellers just getting started.",
    features: [
      "Up to 50 orders/month",
      "50 products",
      "Basic reports",
      "1 team member",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Growth",
    price: 999,
    tag: "Most popular",
    desc: "For sellers doing 200+ orders a month.",
    features: [
      "Unlimited orders",
      "Unlimited products",
      "Expenses & profit reports",
      "Low-stock alerts",
      "3 team members",
    ],
    cta: "Try Growth",
    highlight: true,
  },
  {
    name: "Business",
    price: 2499,
    tag: "For scaling shops",
    desc: "For established brands with multiple channels.",
    features: [
      "Everything in Growth",
      "Invoice branding",
      "Courier API ready",
      "Priority Bangla support",
      "10 team members",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, honest pricing in Taka
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade only when your shop grows.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={`relative border-border/70 ${p.highlight ? "border-primary shadow-lg ring-1 ring-primary/30" : ""}`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {p.tag}
                </span>
              )}
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {p.price === 0 ? "৳0" : formatBDT(p.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {p.price === 0 ? "" : "/month"}
                  </span>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={p.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link to="/signup">{p.cta}</Link>
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

const testimonials = [
  {
    name: "Farzana Islam",
    role: "Owner, Kotha Boutique",
    body: "আগে অর্ডার নিয়ে গুলিয়ে ফেলতাম। ShopPilot BD দিয়ে এখন প্রতিদিনের সেল আর লাভ এক জায়গায় দেখতে পাই।",
  },
  {
    name: "Tanvir Ahmed",
    role: "Founder, Dhaka Leather Co.",
    body: "The COD tracking alone saved us from at least 30,000 taka in lost parcels last month. Absolute must-have.",
  },
  {
    name: "Nusrat Jahan",
    role: "Seller, Nusrat's Closet",
    body: "Finally a tool that speaks my language — Taka, courier, bKash. No more Google Sheets at 2 AM.",
  },
];

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-y border-border bg-muted/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Loved by sellers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            What Bangladeshi sellers are saying
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/70">
              <CardContent className="p-6">
                <MessageCircle className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm leading-relaxed">"{t.body}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
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
            Ready to take control of your shop?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join thousands of Bangladeshi sellers who trust ShopPilot BD to run
            their daily operations. 14 days free, no card required.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/signup">
                Create your free account <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
