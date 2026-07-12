import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Calculator, Info, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatBDT } from "@/lib/format";

export const Route = createFileRoute("/tools/cod-profit")({
  head: () => ({
    meta: [
      { title: "COD Profit Calculator — BepariOS BD" },
      {
        name: "description",
        content:
          "Free COD profit calculator for Bangladeshi online sellers. See your real profit after courier, COD charges, ads and returns.",
      },
      { property: "og:title", content: "COD Profit Calculator — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Calculate real COD profit after courier fees, COD charges, ads and returns.",
      },
      { property: "og:url", content: "https://bepariosbd.lovable.app/tools/cod-profit" },
    ],
    links: [{ rel: "canonical", href: "https://bepariosbd.lovable.app/tools/cod-profit" }],
  }),
  component: CodProfitPage,
});

type FormState = {
  buyingCost: string;
  sellingPrice: string;
  packagingCost: string;
  forwardDelivery: string;
  codCharge: string;
  adCost: string;
  returnDelivery: string;
  returnRate: string;
  monthlyOrders: string;
};

const initialForm: FormState = {
  buyingCost: "",
  sellingPrice: "",
  packagingCost: "",
  forwardDelivery: "",
  codCharge: "",
  adCost: "",
  returnDelivery: "",
  returnRate: "",
  monthlyOrders: "",
};

type Results = {
  deliveredProfit: number;
  returnedLoss: number;
  successRate: number;
  deliveredOrders: number;
  returnedOrders: number;
  profitPerAttempt: number;
  monthlyProfit: number;
  breakEvenAd: number;
  status: "profit" | "low" | "loss";
};

type Errors = Partial<Record<keyof FormState, string>>;

function parseNonNegative(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function validate(form: FormState): { errors: Errors; values?: Record<keyof FormState, number> } {
  const errors: Errors = {};
  const fields: (keyof FormState)[] = [
    "buyingCost",
    "sellingPrice",
    "packagingCost",
    "forwardDelivery",
    "codCharge",
    "adCost",
    "returnDelivery",
    "returnRate",
    "monthlyOrders",
  ];
  const values = {} as Record<keyof FormState, number>;
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
  if (values.returnRate !== undefined && (values.returnRate < 0 || values.returnRate > 100)) {
    errors.returnRate = "Must be between 0 and 100";
  }
  if (values.monthlyOrders !== undefined && !Number.isInteger(values.monthlyOrders)) {
    errors.monthlyOrders = "Must be a whole number";
  }
  if (values.monthlyOrders !== undefined && values.monthlyOrders < 1) {
    errors.monthlyOrders = "Must be at least 1";
  }
  if (Object.keys(errors).length > 0) return { errors };
  return { errors, values };
}

function compute(v: Record<keyof FormState, number>): Results {
  const deliveredProfit =
    v.sellingPrice -
    v.buyingCost -
    v.packagingCost -
    v.forwardDelivery -
    v.codCharge -
    v.adCost;
  const returnedLoss =
    v.packagingCost + v.forwardDelivery + v.returnDelivery + v.adCost;
  const successRate = 100 - v.returnRate;
  const successDec = successRate / 100;
  const returnDec = v.returnRate / 100;
  const deliveredOrders = v.monthlyOrders * successDec;
  const returnedOrders = v.monthlyOrders * returnDec;
  const profitPerAttempt = successDec * deliveredProfit - returnDec * returnedLoss;
  const monthlyProfit = v.monthlyOrders * profitPerAttempt;
  // Break-even ad cost per attempted order: solve profitPerAttempt = 0 for adCost
  // successDec*(SP-BC-Pack-Fwd-COD-Ad) - returnDec*(Pack+Fwd+Return+Ad) = 0
  // -> Ad*(successDec + returnDec) = successDec*(SP-BC-Pack-Fwd-COD) - returnDec*(Pack+Fwd+Return)
  // -> Ad = successDec*(SP-BC-Pack-Fwd-COD) - returnDec*(Pack+Fwd+Return)   [since sum = 1]
  const breakEvenAd =
    successDec * (v.sellingPrice - v.buyingCost - v.packagingCost - v.forwardDelivery - v.codCharge) -
    returnDec * (v.packagingCost + v.forwardDelivery + v.returnDelivery);

  let status: Results["status"];
  if (profitPerAttempt <= 0) status = "loss";
  else if (v.sellingPrice > 0 && profitPerAttempt / v.sellingPrice < 0.1) status = "low";
  else status = "profit";

  return {
    deliveredProfit,
    returnedLoss,
    successRate,
    deliveredOrders,
    returnedOrders,
    profitPerAttempt,
    monthlyProfit,
    breakEvenAd,
    status,
  };
}

const fieldMeta: {
  key: keyof FormState;
  label: string;
  hint?: string;
  step?: string;
  integer?: boolean;
  suffix?: string;
}[] = [
  { key: "buyingCost", label: "Product buying cost", suffix: "৳", step: "0.01" },
  { key: "sellingPrice", label: "Selling price", suffix: "৳", step: "0.01" },
  { key: "packagingCost", label: "Packaging cost", suffix: "৳", step: "0.01" },
  { key: "forwardDelivery", label: "Forward delivery cost", suffix: "৳", step: "0.01" },
  { key: "codCharge", label: "COD / payment processing charge", suffix: "৳", step: "0.01" },
  { key: "adCost", label: "Ad cost per attempted order (FB/IG)", suffix: "৳", step: "0.01" },
  { key: "returnDelivery", label: "Return delivery charge", suffix: "৳", step: "0.01" },
  { key: "returnRate", label: "Expected return rate", suffix: "%", step: "0.1", hint: "0 – 100" },
  { key: "monthlyOrders", label: "Expected monthly orders", integer: true, step: "1" },
];

function CodProfitPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [results, setResults] = useState<Results | null>(null);
  const [submitted, setSubmitted] = useState<Record<keyof FormState, number> | null>(null);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, values } = validate(form);
    setErrors(errs);
    if (values) {
      const r = compute(values);
      // Guard against NaN/Infinity
      const safe = Object.values(r).every((x) =>
        typeof x === "string" ? true : Number.isFinite(x),
      );
      if (safe) {
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
            COD Profit Calculator
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            See your real profit on cash-on-delivery orders
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enter your costs and return rate to estimate delivered-order profit,
            per-attempt profit and monthly earnings — in Taka.
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
                          inputMode={f.integer ? "numeric" : "decimal"}
                          step={f.step}
                          min={0}
                          max={f.key === "returnRate" ? 100 : undefined}
                          value={form[f.key]}
                          onChange={(e) => handleChange(f.key, e.target.value)}
                          className={`${f.suffix ? "pl-7" : ""} ${
                            errors[f.key] ? "border-destructive focus-visible:ring-destructive" : ""
                          }`}
                          placeholder="0"
                          aria-invalid={!!errors[f.key]}
                          aria-describedby={errors[f.key] ? `${f.key}-error` : undefined}
                        />
                      </div>
                      {errors[f.key] && (
                        <p id={`${f.key}-error`} className="text-xs text-destructive">
                          {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={handleReset}>
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
                      label="Estimated monthly profit"
                      value={formatBDT(results.monthlyProfit)}
                      big
                      positive={results.monthlyProfit >= 0}
                    />
                    <Separator />
                    <Metric
                      label="Delivered order profit"
                      value={formatBDT(results.deliveredProfit)}
                      positive={results.deliveredProfit >= 0}
                    />
                    <Metric
                      label="Loss per returned order"
                      value={`− ${formatBDT(Math.abs(results.returnedLoss))}`}
                    />
                    <Metric
                      label="Profit per attempted order"
                      value={formatBDT(results.profitPerAttempt)}
                      positive={results.profitPerAttempt >= 0}
                    />
                    <Metric
                      label="Break-even ad cost / order"
                      value={formatBDT(results.breakEvenAd)}
                    />
                    <Separator />
                    <Metric
                      label="Delivery success rate"
                      value={`${results.successRate.toFixed(1)}%`}
                    />
                    <Metric
                      label="Expected delivered orders"
                      value={results.deliveredOrders.toFixed(1)}
                    />
                    <Metric
                      label="Expected returned orders"
                      value={results.returnedOrders.toFixed(1)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Calculation breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">Delivered order profit</p>
                      <p className="mt-1 text-xs">
                        {formatBDT(submitted.sellingPrice)} − {formatBDT(submitted.buyingCost)} −{" "}
                        {formatBDT(submitted.packagingCost)} −{" "}
                        {formatBDT(submitted.forwardDelivery)} −{" "}
                        {formatBDT(submitted.codCharge)} − {formatBDT(submitted.adCost)} ={" "}
                        <span className="font-medium text-foreground">
                          {formatBDT(results.deliveredProfit)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Loss per returned order</p>
                      <p className="mt-1 text-xs">
                        {formatBDT(submitted.packagingCost)} +{" "}
                        {formatBDT(submitted.forwardDelivery)} +{" "}
                        {formatBDT(submitted.returnDelivery)} + {formatBDT(submitted.adCost)} ={" "}
                        <span className="font-medium text-foreground">
                          {formatBDT(results.returnedLoss)}
                        </span>
                      </p>
                      <p className="mt-1 text-xs italic">
                        Product cost is excluded — returned items may go back to inventory.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Per attempted order</p>
                      <p className="mt-1 text-xs">
                        ({(results.successRate / 100).toFixed(2)} ×{" "}
                        {formatBDT(results.deliveredProfit)}) − (
                        {(submitted.returnRate / 100).toFixed(2)} ×{" "}
                        {formatBDT(results.returnedLoss)}) ={" "}
                        <span className="font-medium text-foreground">
                          {formatBDT(results.profitPerAttempt)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Monthly profit</p>
                      <p className="mt-1 text-xs">
                        {submitted.monthlyOrders} × {formatBDT(results.profitPerAttempt)} ={" "}
                        <span className="font-medium text-foreground">
                          {formatBDT(results.monthlyProfit)}
                        </span>
                      </p>
                    </div>
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
                    Fill in the fields and press Calculate to see your COD profit estimate.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-none" />
              <p>
                These numbers are estimates based on your inputs. Actual results
                vary with courier performance, refund policies, ad performance
                and seasonality.
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
        Profitable
      </div>
    );
  }
  if (status === "low") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4" />
        Low margin
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
      <TrendingDown className="h-4 w-4" />
      Loss
    </div>
  );
}
