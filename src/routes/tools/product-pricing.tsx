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

export const Route = createFileRoute("/tools/product-pricing")({
  head: () => ({
    meta: [
      { title: "Product Pricing Calculator — BepariOS BD" },
      {
        name: "description",
        content:
          "Free product pricing calculator for Bangladeshi online sellers. Find the right selling price, margin and markup — in Taka.",
      },
      {
        property: "og:title",
        content: "Product Pricing Calculator — BepariOS BD",
      },
      {
        property: "og:description",
        content:
          "Set a safe selling price with target margin, platform fees and planned discount.",
      },
      { property: "og:url", content: "https://bepariosbd.lovable.app/tools/product-pricing" },
    ],
    links: [{ rel: "canonical", href: "https://bepariosbd.lovable.app/tools/product-pricing" }],
  }),
  component: ProductPricingPage,
});

type FormState = {
  buyingCost: string;
  packagingCost: string;
  otherCost: string;
  platformFee: string;
  targetMargin: string;
  discount: string;
};

const initialForm: FormState = {
  buyingCost: "",
  packagingCost: "",
  otherCost: "",
  platformFee: "",
  targetMargin: "",
  discount: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

type Results = {
  baseCost: number;
  minSafePrice: number;
  finalPrice: number;
  listPrice: number;
  discountAmount: number;
  feeAmount: number;
  profit: number;
  actualMargin: number;
  markup: number;
  status: "safe" | "low" | "invalid";
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

function validate(
  form: FormState,
): { errors: Errors; values?: Record<keyof FormState, number> } {
  const errors: Errors = {};
  const values = {} as Record<keyof FormState, number>;
  const fields: (keyof FormState)[] = [
    "buyingCost",
    "packagingCost",
    "otherCost",
    "platformFee",
    "targetMargin",
    "discount",
  ];
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
  const pctFields: {
    key: keyof FormState;
    label: string;
  }[] = [
    { key: "platformFee", label: "Platform fee" },
    { key: "targetMargin", label: "Target profit margin" },
    { key: "discount", label: "Discount" },
  ];
  for (const { key, label } of pctFields) {
    const v = values[key];
    if (v !== undefined && v >= 100) {
      errors[key] = `${label} must be less than 100%`;
    }
  }
  if (
    values.platformFee !== undefined &&
    values.targetMargin !== undefined &&
    !errors.platformFee &&
    !errors.targetMargin &&
    values.platformFee + values.targetMargin >= 100
  ) {
    errors.targetMargin =
      "Platform fee + target margin must be less than 100%";
  }
  if (
    values.buyingCost !== undefined &&
    values.packagingCost !== undefined &&
    values.otherCost !== undefined &&
    values.buyingCost + values.packagingCost + values.otherCost <= 0
  ) {
    errors.buyingCost = "Total base cost must be greater than 0";
  }
  if (Object.keys(errors).length > 0) return { errors };
  return { errors, values };
}

function compute(v: Record<keyof FormState, number>): Results {
  const baseCost = v.buyingCost + v.packagingCost + v.otherCost;
  const feeRate = v.platformFee / 100;
  const marginRate = v.targetMargin / 100;
  const discountRate = v.discount / 100;

  const minSafePrice = baseCost / (1 - feeRate);
  const finalPrice = baseCost / (1 - feeRate - marginRate);
  const listPrice = finalPrice / (1 - discountRate);
  const discountAmount = listPrice - finalPrice;
  const feeAmount = finalPrice * feeRate;
  const profit = finalPrice - baseCost - feeAmount;
  const rawActualMargin =
         finalPrice > 0 ? (profit / finalPrice) * 100 : 0;
  const actualMargin = Number(rawActualMargin.toFixed(2)); 
  const markup = baseCost > 0 ? (profit / baseCost) * 100 : 0;

  let status: Results["status"];
  if (!Number.isFinite(finalPrice) || profit <= 0) status = "invalid";
  else if (actualMargin < 10) status = "low";
  else status = "safe";

  return {
    baseCost,
    minSafePrice,
    finalPrice,
    listPrice,
    discountAmount,
    feeAmount,
    profit,
    actualMargin,
    markup,
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
  { key: "packagingCost", label: "Packaging cost", suffix: "৳", step: "0.01" },
  {
    key: "otherCost",
    label: "Other cost per product",
    suffix: "৳",
    step: "0.01",
    hint: "e.g. label, courier prep",
  },
  {
    key: "platformFee",
    label: "Payment / platform fee",
    suffix: "%",
    step: "0.1",
    hint: "0 – <100",
  },
  {
    key: "targetMargin",
    label: "Target profit margin",
    suffix: "%",
    step: "0.1",
    hint: "0 – <100",
  },
  {
    key: "discount",
    label: "Planned discount",
    suffix: "%",
    step: "0.1",
    hint: "0 – <100",
  },
];

function ProductPricingPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [results, setResults] = useState<Results | null>(null);
  const [submitted, setSubmitted] = useState<
    Record<keyof FormState, number> | null
  >(null);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: errs, values } = validate(form);
    setErrors(errs);
    if (values) {
      const r = compute(values);
      const numericOk = [
        r.baseCost,
        r.minSafePrice,
        r.finalPrice,
        r.listPrice,
        r.discountAmount,
        r.feeAmount,
        r.profit,
        r.actualMargin,
        r.markup,
      ].every((x) => Number.isFinite(x));
      if (numericOk) {
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
            Product Pricing Calculator
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Price your products for a safe, healthy profit
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enter your costs, platform fee, target margin and discount to find
            the right selling price — in Taka.
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
                          max={
                            f.key === "platformFee" ||
                            f.key === "targetMargin" ||
                            f.key === "discount"
                              ? 99.99
                              : undefined
                          }
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
                      label="Recommended selling price"
                      value={fmtBDT(results.finalPrice)}
                      big
                      positive={results.profit > 0}
                    />
                    <Separator />
                    <Metric
                      label="Base cost"
                      value={fmtBDT(results.baseCost)}
                    />
                    <Metric
                      label="Minimum safe price"
                      value={fmtBDT(results.minSafePrice)}
                    />
                    <Metric
                      label="List price before discount"
                      value={fmtBDT(results.listPrice)}
                    />
                    <Metric
                      label="Discount amount"
                      value={fmtBDT(results.discountAmount)}
                    />
                    <Metric
                      label="Platform fee amount"
                      value={fmtBDT(results.feeAmount)}
                    />
                    <Separator />
                    <Metric
                      label="Estimated profit"
                      value={fmtBDT(results.profit)}
                      positive={results.profit > 0}
                    />
                    <Metric
                      label="Actual profit margin"
                      value={fmtPct(results.actualMargin)}
                    />
                    <Metric
                      label="Markup"
                      value={fmtPct(results.markup)}
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
                      <p className="font-medium text-foreground">Base cost</p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(submitted.buyingCost)} +{" "}
                        {fmtBDT(submitted.packagingCost)} +{" "}
                        {fmtBDT(submitted.otherCost)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.baseCost)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Minimum safe price
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(results.baseCost)} ÷ (1 −{" "}
                        {(submitted.platformFee / 100).toFixed(2)}) ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.minSafePrice)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Recommended selling price
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(results.baseCost)} ÷ (1 −{" "}
                        {(submitted.platformFee / 100).toFixed(2)} −{" "}
                        {(submitted.targetMargin / 100).toFixed(2)}) ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.finalPrice)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        List price before discount
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(results.finalPrice)} ÷ (1 −{" "}
                        {(submitted.discount / 100).toFixed(2)}) ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.listPrice)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Profit</p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(results.finalPrice)} −{" "}
                        {fmtBDT(results.baseCost)} −{" "}
                        {fmtBDT(results.feeAmount)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.profit)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Margin vs. markup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Profit margin
                      </span>{" "}
                      is profit as a share of the selling price. If you sell at
                      ৳100 and profit ৳20, your margin is 20%.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Markup</span>{" "}
                      is profit as a share of your cost. If your cost is ৳80 and
                      profit is ৳20, your markup is 25%.
                    </p>
                    <p>
                      Markup is always higher than margin for the same product.
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
                    recommended pricing.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-none" />
              <p>
                These numbers are estimates based on your inputs. Actual
                profitability varies with returns, ad spend, refunds and
                seasonal demand.
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
  if (status === "safe") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
        <TrendingUp className="h-4 w-4" />
        Safe pricing
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
      <XCircle className="h-4 w-4" />
      Invalid — profit not achievable
    </div>
  );
}
