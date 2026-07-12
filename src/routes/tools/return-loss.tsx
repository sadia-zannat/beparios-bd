import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Info,
  CheckCircle2,
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

export const Route = createFileRoute("/tools/return-loss")({
  head: () => ({
    meta: [
      { title: "Return Loss Calculator — BepariOS BD" },
      {
        name: "description",
        content:
          "Free return loss calculator for Bangladeshi sellers — estimate how much each returned order actually costs your shop in Taka.",
      },
      {
        property: "og:title",
        content: "Return Loss Calculator — BepariOS BD",
      },
      {
        property: "og:description",
        content:
          "See the real monthly cost of returns and how much you save by lowering your return rate.",
      },
    ],
  }),
  component: ReturnLossPage,
});

type FormState = {
  totalOrders: string;
  returnedOrders: string;
  forwardDelivery: string;
  returnDelivery: string;
  packagingLoss: string;
  adCost: string;
  damagedLoss: string;
};

const initialForm: FormState = {
  totalOrders: "",
  returnedOrders: "",
  forwardDelivery: "",
  returnDelivery: "",
  packagingLoss: "",
  adCost: "",
  damagedLoss: "",
};

type Errors = Partial<Record<keyof FormState, string>>;
type Values = Record<keyof FormState, number>;

type Results = {
  successfulOrders: number;
  returnedOrders: number;
  returnRate: number;
  lossPerReturn: number;
  totalMonthlyLoss: number;
  effectivePerOrder: number;
  saving1pp: number;
  saving3pp: number;
  saving5pp: number;
  status: "healthy" | "attention" | "high";
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

function fmtInt(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
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

  if (values.totalOrders !== undefined) {
    if (!Number.isInteger(values.totalOrders)) {
      errors.totalOrders = "Must be a whole number";
    } else if (values.totalOrders <= 0) {
      errors.totalOrders = "Must be greater than 0";
    }
  }
  if (values.returnedOrders !== undefined) {
    if (!Number.isInteger(values.returnedOrders)) {
      errors.returnedOrders = "Must be a whole number";
    }
  }
  if (
    !errors.totalOrders &&
    !errors.returnedOrders &&
    values.totalOrders !== undefined &&
    values.returnedOrders !== undefined &&
    values.returnedOrders > values.totalOrders
  ) {
    errors.returnedOrders = "Cannot be greater than total orders";
  }

  if (Object.keys(errors).length > 0) return { errors };
  return { errors, values };
}

function compute(v: Values): Results {
  const successfulOrders = v.totalOrders - v.returnedOrders;
  const returnRate =
    v.totalOrders > 0 ? (v.returnedOrders / v.totalOrders) * 100 : 0;
  const lossPerReturn =
    v.forwardDelivery +
    v.returnDelivery +
    v.packagingLoss +
    v.adCost +
    v.damagedLoss;
  const totalMonthlyLoss = v.returnedOrders * lossPerReturn;
  const effectivePerOrder =
    v.totalOrders > 0 ? totalMonthlyLoss / v.totalOrders : 0;

  const savingFor = (pp: number) => {
    const targetRate = Math.max(returnRate - pp, 0);
    const expectedReturned = (targetRate / 100) * v.totalOrders;
    const avoided = Math.max(v.returnedOrders - expectedReturned, 0);
    return avoided * lossPerReturn;
  };

  let status: Results["status"];
  if (returnRate < 5) status = "healthy";
  else if (returnRate < 10) status = "attention";
  else status = "high";

  return {
    successfulOrders,
    returnedOrders: v.returnedOrders,
    returnRate,
    lossPerReturn,
    totalMonthlyLoss,
    effectivePerOrder,
    saving1pp: savingFor(1),
    saving3pp: savingFor(3),
    saving5pp: savingFor(5),
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
  { key: "totalOrders", label: "Total monthly orders", step: "1" },
  { key: "returnedOrders", label: "Returned orders", step: "1" },
  {
    key: "forwardDelivery",
    label: "Forward delivery cost per returned order",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "returnDelivery",
    label: "Return delivery charge per returned order",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "packagingLoss",
    label: "Packaging loss per return",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "adCost",
    label: "Advertising cost per returned order",
    suffix: "৳",
    step: "0.01",
  },
  {
    key: "damagedLoss",
    label: "Damaged / unsellable product loss per return",
    suffix: "৳",
    step: "0.01",
  },
];

function ReturnLossPage() {
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
        r.successfulOrders,
        r.returnRate,
        r.lossPerReturn,
        r.totalMonthlyLoss,
        r.effectivePerOrder,
        r.saving1pp,
        r.saving3pp,
        r.saving5pp,
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
            Return Loss Calculator
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            See how much returns really cost your shop
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Enter your monthly orders and per-return costs to see your true
            monthly return loss — and how much you'd save by lowering your
            return rate.
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
                      label="Total monthly return loss"
                      value={fmtBDT(results.totalMonthlyLoss)}
                      big
                      negative
                    />
                    <Separator />
                    <Metric
                      label="Current return rate"
                      value={fmtPct(results.returnRate)}
                    />
                    <Metric
                      label="Successful orders"
                      value={fmtInt(results.successfulOrders)}
                    />
                    <Metric
                      label="Returned orders"
                      value={fmtInt(results.returnedOrders)}
                    />
                    <Metric
                      label="Loss per returned order"
                      value={fmtBDT(results.lossPerReturn)}
                    />
                    <Metric
                      label="Effective return cost per placed order"
                      value={fmtBDT(results.effectivePerOrder)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Potential monthly savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Metric
                      label="If return rate drops by 1 pp"
                      value={fmtBDT(results.saving1pp)}
                      positive
                    />
                    <Metric
                      label="If return rate drops by 3 pp"
                      value={fmtBDT(results.saving3pp)}
                      positive
                    />
                    <Metric
                      label="If return rate drops by 5 pp"
                      value={fmtBDT(results.saving5pp)}
                      positive
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
                      <p className="font-medium text-foreground">Return rate</p>
                      <p className="mt-1 text-xs">
                        {fmtInt(submitted.returnedOrders)} ÷{" "}
                        {fmtInt(submitted.totalOrders)} × 100 ={" "}
                        <span className="font-medium text-foreground">
                          {fmtPct(results.returnRate)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Loss per returned order
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(submitted.forwardDelivery)} +{" "}
                        {fmtBDT(submitted.returnDelivery)} +{" "}
                        {fmtBDT(submitted.packagingLoss)} +{" "}
                        {fmtBDT(submitted.adCost)} +{" "}
                        {fmtBDT(submitted.damagedLoss)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.lossPerReturn)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Total monthly return loss
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtInt(submitted.returnedOrders)} ×{" "}
                        {fmtBDT(results.lossPerReturn)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.totalMonthlyLoss)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Effective return cost per placed order
                      </p>
                      <p className="mt-1 text-xs">
                        {fmtBDT(results.totalMonthlyLoss)} ÷{" "}
                        {fmtInt(submitted.totalOrders)} ={" "}
                        <span className="font-medium text-foreground">
                          {fmtBDT(results.effectivePerOrder)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Why these costs count
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Forward delivery
                      </span>{" "}
                      is what you paid the courier to send the parcel — that
                      money is gone even if the buyer refuses it.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Return delivery
                      </span>{" "}
                      is the charge to bring the parcel back to your warehouse.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Packaging
                      </span>{" "}
                      (box, poly, tape, label) is usually damaged on return
                      and needs to be redone.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Advertising
                      </span>{" "}
                      is the ad money spent to win that order — it isn't
                      refunded when the buyer returns.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Damaged / unsellable product
                      </span>{" "}
                      is the value lost when the returned item can't be resold
                      at full price.
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
                    monthly return loss.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-none" />
              <p>
                These numbers are estimates based on your inputs. Actual return
                losses depend on courier terms, refunds, product condition on
                return and other market factors.
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
  negative,
}: {
  label: string;
  value: string;
  big?: boolean;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = negative
    ? "text-destructive"
    : positive
      ? "text-primary"
      : "text-foreground";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`font-semibold tabular-nums ${big ? "text-2xl" : "text-sm"} ${color}`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Results["status"] }) {
  if (status === "healthy") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
        <CheckCircle2 className="h-4 w-4" />
        Healthy return rate
      </div>
    );
  }
  if (status === "attention") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4" />
        Needs attention
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
      <XCircle className="h-4 w-4" />
      High return loss
    </div>
  );
}
