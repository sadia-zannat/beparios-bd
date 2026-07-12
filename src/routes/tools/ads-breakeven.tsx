import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Info,
  TrendingUp,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/tools/ads-breakeven")({
  head: () => ({
    meta: [
      { title: "Facebook Ads Break-even Calculator — BepariOS BD" },
      {
        name: "description",
        content:
          "Free Facebook Ads break-even calculator for Bangladeshi sellers — find your CPA, ROAS and maximum safe ad spend in Taka.",
      },
      {
        property: "og:title",
        content: "Facebook Ads Break-even Calculator — BepariOS BD",
      },
      {
        property: "og:description",
        content:
          "Know your break-even CPA and ROAS before scaling Facebook ads.",
      },
    ],
  }),
  component: AdsBreakevenPage,
});

type FormState = {
  buyingCost: string;
  sellingPrice: string;
  packagingCost: string;
  forwardDelivery: string;
  codCharge: string;
  returnDelivery: string;
  returnRate: string;
  adSpend: string;
  adClicks: string;
  ordersReceived: string;
};

const initialForm: FormState = {
  buyingCost: "",
  sellingPrice: "",
  packagingCost: "",
  forwardDelivery: "",
  codCharge: "",
  returnDelivery: "",
  returnRate: "",
  adSpend: "",
  adClicks: "",
  ordersReceived: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

type Values = Record<keyof FormState, number>;

type Results = {
  deliveredOrders: number;
  returnedOrders: number;
  deliveredProfitPerOrder: number;
  returnedLossPerOrder: number;
  cpc: number;
  cpa: number;
  orderConvRate: number;
  deliveredConvRate: number;
  opProfitBeforeAds: number;
  campaignProfit: number;
  deliveredRevenue: number;
  currentRoas: number | null;
  breakEvenCPA: number;
  breakEvenSpend: number;
  breakEvenRoas: number | null;
  status: "profit" | "break" | "loss";
};

function fmtBDT(n: number): string {
  return `৳${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtPct(n: number): string {
  return `${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function fmtRoas(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "Not applicable";
  return `${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}x`;
}

function validate(form: FormState): { errors: Errors; values?: Values } {
  const errors: Errors = {};
  const values = {} as Values;
  const fields = Object.keys(initialForm) as (keyof FormState)[];

  for (const f of fields) {
    const raw = form[f];
    if (raw.trim() === "") {
      errors[f] = "Required";
      continue;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      errors[f] = "Enter a valid number";
      continue;
    }
    if (n < 0) {
      errors[f] = "Cannot be negative";
      continue;
    }
    values[f] = n;
  }

  if (values.returnRate !== undefined && values.returnRate > 100) {
    errors.returnRate = "Must be between 0 and 100";
  }
  if (values.sellingPrice !== undefined && values.sellingPrice <= 0) {
    errors.sellingPrice = "Must be greater than 0";
  }
  if (values.adClicks !== undefined) {
    if (!Number.isInteger(values.adClicks)) {
      errors.adClicks = "Must be a whole number";
    } else if (values.adClicks <= 0) {
      errors.adClicks = "Must be greater than 0";
    }
  }
  if (values.ordersReceived !== undefined) {
    if (!Number.isInteger(values.ordersReceived)) {
      errors.ordersReceived = "Must be a whole number";
    }
  }
  if (
    !errors.adClicks &&
    !errors.ordersReceived &&
    values.adClicks !== undefined &&
    values.ordersReceived !== undefined &&
    values.ordersReceived > values.adClicks
  ) {
    errors.ordersReceived = "Cannot be greater than ad clicks";
  }

  if (Object.keys(errors).length > 0) return { errors };
  return { errors, values };
}

function compute(v: Values): Results {
  const returnDec = v.returnRate / 100;
  const successDec = 1 - returnDec;

  const deliveredOrders = v.ordersReceived * successDec;
  const returnedOrders = v.ordersReceived * returnDec;

  const deliveredProfitPerOrder =
    v.sellingPrice -
    v.buyingCost -
    v.packagingCost -
    v.forwardDelivery -
    v.codCharge;

  const returnedLossPerOrder =
    v.packagingCost + v.forwardDelivery + v.returnDelivery;

  const cpc = v.adClicks > 0 ? v.adSpend / v.adClicks : 0;
  const cpa = v.ordersReceived > 0 ? v.adSpend / v.ordersReceived : 0;
  const orderConvRate =
    v.adClicks > 0 ? (v.ordersReceived / v.adClicks) * 100 : 0;
  const deliveredConvRate =
    v.adClicks > 0 ? (deliveredOrders / v.adClicks) * 100 : 0;

  const opProfitBeforeAds =
    deliveredOrders * deliveredProfitPerOrder -
    returnedOrders * returnedLossPerOrder;

  const campaignProfit = opProfitBeforeAds - v.adSpend;

  const deliveredRevenue = deliveredOrders * v.sellingPrice;

  const currentRoas =
    v.adSpend > 0 ? deliveredRevenue / v.adSpend : null;

  const breakEvenCPA =
    successDec * deliveredProfitPerOrder - returnDec * returnedLossPerOrder;

  const breakEvenSpend = breakEvenCPA * v.ordersReceived;

  const breakEvenRoas =
    breakEvenSpend > 0 ? deliveredRevenue / breakEvenSpend : null;

  let status: Results["status"];
  if (campaignProfit > 0.5) status = "profit";
  else if (campaignProfit < -0.5) status = "loss";
  else status = "break";

  return {
    deliveredOrders,
    returnedOrders,
    deliveredProfitPerOrder,
    returnedLossPerOrder,
    cpc,
    cpa,
    orderConvRate,
    deliveredConvRate,
    opProfitBeforeAds,
    campaignProfit,
    deliveredRevenue,
    currentRoas,
    breakEvenCPA,
    breakEvenSpend,
    breakEvenRoas,
    status,
  };
}

const fieldMeta: {
  key: keyof FormState;
  label: string;
  hint?: string;
  suffix?: string;
  step?: string;
}[] = [
  { key: "buyingCost", label: "Product buying cost", suffix: "৳", step: "0.01" },
  { key: "sellingPrice", label: "Selling price", suffix: "৳", step: "0.01" },
  { key: "packagingCost", label: "Packaging cost", suffix: "৳", step: "0.01" },
  {
    key: "forwardDelivery",
    label: "Forward delivery cost (seller-paid)",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "codCharge",
    label: "COD / payment processing charge",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "returnDelivery",
    label: "Return delivery charge",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "returnRate",
    label: "Expected return rate",
    suffix: "%",
    step: "0.1",
    hint: "0 – 100",
  },
  {
    key: "adSpend",
    label: "Total advertising spend",
    suffix: "৳",
    step: "0.01",
  },
  { key: "adClicks", label: "Number of ad clicks", step: "1" },
  { key: "ordersReceived", label: "Orders received", step: "1" },
];

function AdsBreakevenPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [results, setResults] = useState<Results | null>(null);
  const [submitted, setSubmitted] = useState<Values | null>(null);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, values } = validate(form);
    setErrors(errs);
    if (values) {
      const r = compute(values);
      const nums = [
        r.deliveredOrders,
        r.returnedOrders,
        r.deliveredProfitPerOrder,
        r.returnedLossPerOrder,
        r.cpc,
        r.cpa,
        r.orderConvRate,
        r.deliveredConvRate,
        r.opProfitBeforeAds,
        r.campaignProfit,
        r.deliveredRevenue,
        r.breakEvenCPA,
        r.breakEvenSpend,
      ];
      if (nums.every((x) => Number.isFinite(x))) {
        setResults(r);
        setSubmitted(values);
      } else {
        setResults(null);
        setSubmitted(null);
      }
    } else {
      setResults(null);
      setSubmitted(null);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setResults(null);
    setSubmitted(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link to="/tools">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to all tools
            </Link>
          </Button>
          <Badge
            variant="secondary"
            className="mb-3 rounded-full border border-border/60 px-3 py-1 text-xs font-medium"
          >
            <Calculator className="mr-2 h-3.5 w-3.5 text-primary" />
            Facebook Ads Break-even Calculator
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Know your break-even CPA and ROAS before you scale
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enter your product economics and campaign numbers to see the maximum
            ad cost per order you can afford — in Taka.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-5">
          {/* Form */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Your numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fieldMeta.map((f) => (
                    <div key={f.key} className="space-y-1.5">
                      <Label htmlFor={f.key} className="text-sm">
                        {f.label}
                        {f.hint && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({f.hint})
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        {f.suffix && (
                          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                            {f.suffix}
                          </span>
                        )}
                        <Input
                          id={f.key}
                          type="number"
                          inputMode="decimal"
                          step={f.step}
                          min={0}
                          max={f.key === "returnRate" ? 100 : undefined}
                          value={form[f.key]}
                          onChange={(e) =>
                            handleChange(f.key, e.target.value)
                          }
                          className={`${f.suffix ? "pl-7" : ""} ${
                            errors[f.key]
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          placeholder="0"
                          aria-invalid={!!errors[f.key]}
                          aria-describedby={
                            errors[f.key] ? `${f.key}-error` : undefined
                          }
                        />
                      </div>
                      {errors[f.key] && (
                        <p
                          id={`${f.key}-error`}
                          className="text-xs text-destructive"
                        >
                          {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Calculate</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6 lg:col-span-2">
            {results && submitted ? (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StatusBadge status={results.status} />
                    <Metric
                      label="Estimated campaign profit"
                      value={fmtBDT(results.campaignProfit)}
                      big
                      positive={results.campaignProfit > 0}
                    />
                    <Separator />
                    <Metric label="Cost per click (CPC)" value={fmtBDT(results.cpc)} />
                    <Metric label="Current CPA" value={fmtBDT(results.cpa)} />
                    <Metric
                      label="Order conversion rate"
                      value={fmtPct(results.orderConvRate)}
                    />
                    <Metric
                      label="Delivered conversion rate"
                      value={fmtPct(results.deliveredConvRate)}
                    />
                    <Metric
                      label="Expected delivered orders"
                      value={results.deliveredOrders.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    />
                    <Metric
                      label="Expected returned orders"
                      value={results.returnedOrders.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    />
                    <Metric
                      label="Delivered revenue"
                      value={fmtBDT(results.deliveredRevenue)}
                    />
                    <Metric
                      label="Current ROAS"
                      value={fmtRoas(results.currentRoas)}
                    />
                    <Separator />
                    <Metric
                      label="Break-even CPA (max safe ad cost / order)"
                      value={fmtBDT(Math.max(0, results.breakEvenCPA))}
                      positive={results.breakEvenCPA > 0}
                    />
                    <Metric
                      label="Break-even total ad spend"
                      value={fmtBDT(Math.max(0, results.breakEvenSpend))}
                    />
                    <Metric
                      label="Break-even ROAS"
                      value={fmtRoas(results.breakEvenRoas)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Calculation breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">
                        Delivered profit per order
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(submitted.sellingPrice)} −{" "}
                        {fmtBDT(submitted.buyingCost)} −{" "}
                        {fmtBDT(submitted.packagingCost)} −{" "}
                        {fmtBDT(submitted.forwardDelivery)} −{" "}
                        {fmtBDT(submitted.codCharge)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.deliveredProfitPerOrder)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Returned loss per order
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(submitted.packagingCost)} +{" "}
                        {fmtBDT(submitted.forwardDelivery)} +{" "}
                        {fmtBDT(submitted.returnDelivery)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.returnedLossPerOrder)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Operational profit before ads
                      </p>
                      <p className="mt-1 text-xs">
                        ({results.deliveredOrders.toFixed(2)} ×{" "}
                        {fmtBDT(results.deliveredProfitPerOrder)}) − (
                        {results.returnedOrders.toFixed(2)} ×{" "}
                        {fmtBDT(results.returnedLossPerOrder)}) ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.opProfitBeforeAds)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Campaign profit
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(results.opProfitBeforeAds)} −{" "}
                        {fmtBDT(submitted.adSpend)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.campaignProfit)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Break-even CPA
                      </p>
                      <p className="mt-1 text-xs">
                        ({(1 - submitted.returnRate / 100).toFixed(2)} ×{" "}
                        {fmtBDT(results.deliveredProfitPerOrder)}) − (
                        {(submitted.returnRate / 100).toFixed(2)} ×{" "}
                        {fmtBDT(results.returnedLossPerOrder)}) ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.breakEvenCPA)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      What these mean
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">CPC</span>{" "}
                      (cost per click) is how much you pay Facebook for each
                      click on your ad.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">CPA</span>{" "}
                      (cost per order) is your ad spend divided by orders
                      received — the ad cost of getting one order.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Conversion rate
                      </span>{" "}
                      is the share of clicks that turned into orders.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">ROAS</span>{" "}
                      (return on ad spend) is delivered revenue ÷ ad spend. A
                      3.00x ROAS means ৳3 delivered revenue for every ৳1 spent.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">No results yet</p>
                  <p className="text-xs text-muted-foreground">
                    Fill in the fields and press Calculate to see your
                    campaign break-even numbers.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-none" />
              <p>
                These numbers are estimates based on your inputs. Actual
                results depend on real return rates, delivery success, refunds
                and market conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function Metric({
  label,
  value,
  big,
  positive,
}: {
  label: string;
  value: string;
  big?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`font-semibold tabular-nums ${big ? "text-2xl" : "text-sm"} ${
          positive === undefined
            ? "text-foreground"
            : positive
              ? "text-primary"
              : "text-destructive"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Results["status"] }) {
  if (status === "profit") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
        <TrendingUp className="h-4 w-4" />
        Profitable campaign
      </div>
    );
  }
  if (status === "break") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4" />
        Break-even
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
      <XCircle className="h-4 w-4" />
      Losing money
    </div>
  );
}
