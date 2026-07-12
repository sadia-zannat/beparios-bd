import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Info,
  Plus,
  Printer,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tools/invoice")({
  head: () => ({
    meta: [
      { title: "Free Invoice Generator — BepariOS BD" },
      {
        name: "description",
        content:
          "Free BDT invoice generator for Bangladeshi online sellers — create, print and save invoices as PDF. No signup required.",
      },
      { property: "og:title", content: "Free Invoice Generator — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Generate clean BDT invoices for your customers in seconds. Print or save as PDF from your browser.",
      },
    ],
  }),
  component: InvoicePage,
});

type PaymentMethod =
  | "Cash on Delivery"
  | "Cash"
  | "bKash"
  | "Nagad"
  | "Bank transfer"
  | "Other";

const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash on Delivery",
  "Cash",
  "bKash",
  "Nagad",
  "Bank transfer",
  "Other",
];

type ItemRow = {
  id: string;
  name: string;
  qty: string;
  price: string;
};

type FormState = {
  shopName: string;
  shopPhone: string;
  shopEmail: string;
  shopAddress: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMethod: PaymentMethod;
  notes: string;
  items: ItemRow[];
  deliveryCharge: string;
  discount: string;
  paidAmount: string;
};

type ItemErrors = { name?: string; qty?: string; price?: string };
type Errors = {
  shopName?: string;
  customerName?: string;
  customerPhone?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  deliveryCharge?: string;
  discount?: string;
  paidAmount?: string;
  items?: ItemErrors[];
};

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function defaultInvoiceNumber(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${yyyy}${mm}${dd}-${rand}`;
}

function newRow(): ItemRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    qty: "1",
    price: "",
  };
}

function fmtBDT(n: number): string {
  if (!Number.isFinite(n)) return "৳0.00";
  return `৳${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toNum(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function computeTotals(form: FormState) {
  const lines = form.items.map((it) => {
    const qty = toNum(it.qty);
    const price = toNum(it.price);
    const total = qty * price;
    return { ...it, qtyNum: qty, priceNum: price, total };
  });
  const subtotal = lines.reduce((s, l) => s + (Number.isFinite(l.total) ? l.total : 0), 0);
  const delivery = toNum(form.deliveryCharge);
  const discount = toNum(form.discount);
  const paid = toNum(form.paidAmount);
  const grandTotal = subtotal + delivery - discount;
  const due = grandTotal - paid;

  let status: "Unpaid" | "Partial" | "Paid";
  if (paid <= 0) status = "Unpaid";
  else if (paid >= grandTotal) status = "Paid";
  else status = "Partial";

  return { lines, subtotal, delivery, discount, paid, grandTotal, due, status };
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.shopName.trim()) errors.shopName = "Shop name is required";
  if (!form.customerName.trim())
    errors.customerName = "Customer name is required";
  if (!form.customerPhone.trim())
    errors.customerPhone = "Customer phone is required";
  if (!form.invoiceNumber.trim())
    errors.invoiceNumber = "Invoice number is required";
  if (!form.invoiceDate.trim())
    errors.invoiceDate = "Invoice date is required";

  const itemErrors: ItemErrors[] = form.items.map((it) => {
    const e: ItemErrors = {};
    if (!it.name.trim()) e.name = "Required";
    const qty = Number(it.qty);
    if (it.qty.trim() === "" || !Number.isFinite(qty)) {
      e.qty = "Required";
    } else if (!Number.isInteger(qty)) {
      e.qty = "Whole number";
    } else if (qty <= 0) {
      e.qty = "Must be > 0";
    }
    const price = Number(it.price);
    if (it.price.trim() === "" || !Number.isFinite(price)) {
      e.price = "Required";
    } else if (price < 0) {
      e.price = "Cannot be negative";
    }
    return e;
  });
  if (itemErrors.some((e) => Object.keys(e).length > 0)) {
    errors.items = itemErrors;
  }

  const numField = (key: "deliveryCharge" | "discount" | "paidAmount", label: string) => {
    const raw = form[key];
    if (raw.trim() === "") return;
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      errors[key] = `${label} must be a number`;
    } else if (n < 0) {
      errors[key] = `${label} cannot be negative`;
    }
  };
  numField("deliveryCharge", "Delivery charge");
  numField("discount", "Discount");
  numField("paidAmount", "Paid amount");

  const totals = computeTotals(form);
  if (
    !errors.discount &&
    totals.discount > totals.subtotal + totals.delivery
  ) {
    errors.discount = "Discount cannot exceed subtotal + delivery";
  }
  if (!errors.paidAmount && totals.paid > totals.grandTotal) {
    errors.paidAmount = "Paid amount cannot exceed grand total";
  }

  return errors;
}

function hasErrors(e: Errors): boolean {
  const keys: (keyof Errors)[] = [
    "shopName",
    "customerName",
    "customerPhone",
    "invoiceNumber",
    "invoiceDate",
    "deliveryCharge",
    "discount",
    "paidAmount",
  ];
  if (keys.some((k) => e[k])) return true;
  if (e.items && e.items.some((r) => Object.keys(r).length > 0)) return true;
  return false;
}

function buildInitial(): FormState {
  return {
    shopName: "",
    shopPhone: "",
    shopEmail: "",
    shopAddress: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    invoiceNumber: defaultInvoiceNumber(),
    invoiceDate: todayISO(),
    paymentMethod: "Cash on Delivery",
    notes: "",
    items: [newRow()],
    deliveryCharge: "",
    discount: "",
    paidAmount: "",
  };
}

function InvoicePage() {
  const [form, setForm] = useState<FormState>(() => buildInitial());
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copyMsg, setCopyMsg] = useState<
    { kind: "ok" | "err"; text: string } | null
  >(null);

  const totals = useMemo(() => computeTotals(form), [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const updateItem = (id: string, patch: Partial<ItemRow>) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  };

  const addRow = () => {
    setForm((f) => ({ ...f, items: [...f.items, newRow()] }));
  };

  const removeRow = (id: string) => {
    setForm((f) => {
      if (f.items.length <= 1) return f;
      return { ...f, items: f.items.filter((it) => it.id !== id) };
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(buildInitial());
    setErrors({});
    setSubmitted(false);
    setCopyMsg(null);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const buildWhatsAppSummary = (): string => {
    const t = totals;
    const lines: string[] = [];
    lines.push(`*${form.shopName || "Shop"}*`);
    lines.push(`Invoice: ${form.invoiceNumber}`);
    lines.push(`Customer: ${form.customerName}`);
    lines.push("");
    lines.push("Items:");
    t.lines.forEach((l) => {
      const nm = l.name.trim() || "Item";
      lines.push(`- ${nm} × ${l.qtyNum} = ${fmtBDT(l.total)}`);
    });
    lines.push("");
    lines.push(`Grand total: ${fmtBDT(t.grandTotal)}`);
    lines.push(`Paid: ${fmtBDT(t.paid)}`);
    lines.push(`Due: ${fmtBDT(t.due)}`);
    lines.push(`Payment: ${form.paymentMethod} (${t.status})`);
    return lines.join("\n");
  };

  const handleCopyWhatsApp = async () => {
    const errs = validate(form);
    setErrors(errs);
    setSubmitted(true);
    if (hasErrors(errs)) {
      setCopyMsg({
        kind: "err",
        text: "Fix the highlighted fields before copying.",
      });
      return;
    }
    const text = buildWhatsAppSummary();
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(text);
        setCopyMsg({ kind: "ok", text: "WhatsApp summary copied to clipboard." });
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch {
      setCopyMsg({
        kind: "err",
        text: "Couldn't copy — your browser blocked clipboard access. Try again or copy manually from the preview.",
      });
    }
  };

  const showPreview = submitted && !hasErrors(errors);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="no-print">
        <LandingNav />
      </div>

      <section className="no-print border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
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
            <FileText className="mr-2 h-3.5 w-3.5 text-primary" />
            Free Invoice Generator
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Create a clean BDT invoice in seconds
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Fill in the details, preview the invoice live, then print or save
            it as PDF from your browser. Nothing is uploaded or stored.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          {/* Form */}
          <div className="no-print space-y-6">
            <form onSubmit={handleCalculate} noValidate className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your shop</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Shop name"
                    required
                    value={form.shopName}
                    onChange={(v) => update("shopName", v)}
                    error={errors.shopName}
                  />
                  <Field
                    label="Shop phone"
                    value={form.shopPhone}
                    onChange={(v) => update("shopPhone", v)}
                  />
                  <Field
                    label="Shop email"
                    hint="optional"
                    type="email"
                    value={form.shopEmail}
                    onChange={(v) => update("shopEmail", v)}
                  />
                  <Field
                    label="Shop address"
                    value={form.shopAddress}
                    onChange={(v) => update("shopAddress", v)}
                    className="sm:col-span-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Customer name"
                    required
                    value={form.customerName}
                    onChange={(v) => update("customerName", v)}
                    error={errors.customerName}
                  />
                  <Field
                    label="Customer phone"
                    required
                    value={form.customerPhone}
                    onChange={(v) => update("customerPhone", v)}
                    error={errors.customerPhone}
                  />
                  <Field
                    label="Customer address"
                    value={form.customerAddress}
                    onChange={(v) => update("customerAddress", v)}
                    className="sm:col-span-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invoice details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Invoice number"
                    required
                    value={form.invoiceNumber}
                    onChange={(v) => update("invoiceNumber", v)}
                    error={errors.invoiceNumber}
                  />
                  <Field
                    label="Invoice date"
                    required
                    type="date"
                    value={form.invoiceDate}
                    onChange={(v) => update("invoiceDate", v)}
                    error={errors.invoiceDate}
                  />
                  <div className="space-y-1.5">
                    <Label className="text-sm">Payment method</Label>
                    <Select
                      value={form.paymentMethod}
                      onValueChange={(v) =>
                        update("paymentMethod", v as PaymentMethod)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="notes" className="text-sm">
                      Notes{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Delivery instructions, thanks message, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">Items</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addRow}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add row
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.items.map((it, i) => {
                    const ie = errors.items?.[i] ?? {};
                    const qty = toNum(it.qty);
                    const price = toNum(it.price);
                    const line = qty * price;
                    return (
                      <div
                        key={it.id}
                        className="rounded-md border border-border/70 p-3"
                      >
                        <div className="grid gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-6">
                            <Label className="text-xs">Product / service</Label>
                            <Input
                              value={it.name}
                              onChange={(e) =>
                                updateItem(it.id, { name: e.target.value })
                              }
                              placeholder="Item name"
                              className={
                                ie.name
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : ""
                              }
                            />
                            {ie.name && (
                              <p className="mt-1 text-xs text-destructive">
                                {ie.name}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <Label className="text-xs">Qty</Label>
                            <Input
                              type="number"
                              inputMode="numeric"
                              step="1"
                              min={1}
                              value={it.qty}
                              onChange={(e) =>
                                updateItem(it.id, { qty: e.target.value })
                              }
                              className={
                                ie.qty
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : ""
                              }
                            />
                            {ie.qty && (
                              <p className="mt-1 text-xs text-destructive">
                                {ie.qty}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-3">
                            <Label className="text-xs">Unit price (৳)</Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min={0}
                              value={it.price}
                              onChange={(e) =>
                                updateItem(it.id, { price: e.target.value })
                              }
                              placeholder="0.00"
                              className={
                                ie.price
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : ""
                              }
                            />
                            {ie.price && (
                              <p className="mt-1 text-xs text-destructive">
                                {ie.price}
                              </p>
                            )}
                          </div>
                          <div className="flex items-end justify-end sm:col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Remove row"
                              onClick={() => removeRow(it.id)}
                              disabled={form.items.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-right text-xs text-muted-foreground">
                          Line total:{" "}
                          <span className="font-medium text-foreground">
                            {fmtBDT(line)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Amounts</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  <Field
                    label="Delivery charge (৳)"
                    type="number"
                    value={form.deliveryCharge}
                    onChange={(v) => update("deliveryCharge", v)}
                    error={errors.deliveryCharge}
                    placeholder="0.00"
                    step="0.01"
                    min={0}
                  />
                  <Field
                    label="Discount (৳)"
                    type="number"
                    value={form.discount}
                    onChange={(v) => update("discount", v)}
                    error={errors.discount}
                    placeholder="0.00"
                    step="0.01"
                    min={0}
                  />
                  <Field
                    label="Paid amount (৳)"
                    type="number"
                    value={form.paidAmount}
                    onChange={(v) => update("paidAmount", v)}
                    error={errors.paidAmount}
                    placeholder="0.00"
                    step="0.01"
                    min={0}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Button type="submit">Calculate / Update invoice</Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                  disabled={!showPreview}
                >
                  <Printer className="mr-1.5 h-4 w-4" />
                  Print invoice
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyWhatsApp}
                >
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Copy WhatsApp summary
                </Button>
              </div>

              {copyMsg && (
                <div
                  className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                    copyMsg.kind === "ok"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  {copyMsg.kind === "ok" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                  )}
                  <p>{copyMsg.text}</p>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-md border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 flex-none" />
                <p>
                  Privacy: everything you type stays in your browser session.
                  BepariOS BD does not upload, save or store your invoice data.
                </p>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            {showPreview ? (
              <InvoicePreview form={form} totals={totals} />
            ) : (
              <Card className="no-print border-dashed">
                <CardContent className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium">Invoice preview</p>
                  <p className="text-xs text-muted-foreground">
                    Fill in the fields and press Calculate / Update invoice
                    to see your invoice here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <div className="no-print">
        <LandingFooter />
      </div>

      <style>{printCSS}</style>
    </div>
  );
}

function InvoicePreview({
  form,
  totals,
}: {
  form: FormState;
  totals: ReturnType<typeof computeTotals>;
}) {
  return (
    <div id="invoice-print" className="invoice-print rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            BepariOS BD Free Invoice Generator
          </p>
          <h2 className="mt-1 text-xl font-bold">{form.shopName}</h2>
          <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
            {form.shopPhone && <p>Phone: {form.shopPhone}</p>}
            {form.shopEmail && <p>Email: {form.shopEmail}</p>}
            {form.shopAddress && <p>{form.shopAddress}</p>}
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="text-sm font-semibold uppercase text-foreground">
            Invoice
          </p>
          <p className="mt-1 text-muted-foreground">
            <span className="font-medium text-foreground">No: </span>
            {form.invoiceNumber}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Date: </span>
            {fmtDate(form.invoiceDate)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Bill to
        </p>
        <p className="mt-1 text-sm font-semibold">{form.customerName}</p>
        <div className="mt-0.5 space-y-0.5 text-xs text-muted-foreground">
          <p>Phone: {form.customerPhone}</p>
          {form.customerAddress && <p>{form.customerAddress}</p>}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2 text-right">Qty</th>
              <th className="px-3 py-2 text-right">Unit price</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {totals.lines.map((l) => (
              <tr key={l.id} className="align-top">
                <td className="px-3 py-2">{l.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {l.qtyNum}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {fmtBDT(l.priceNum)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium">
                  {fmtBDT(l.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <dl className="w-full max-w-xs space-y-1.5 text-sm">
          <Row label="Subtotal" value={fmtBDT(totals.subtotal)} />
          <Row label="Delivery" value={fmtBDT(totals.delivery)} />
          <Row label="Discount" value={`− ${fmtBDT(totals.discount)}`} />
          <div className="my-1 border-t border-border" />
          <Row
            label="Grand total"
            value={fmtBDT(totals.grandTotal)}
            bold
          />
          <Row label="Paid" value={fmtBDT(totals.paid)} />
          <Row
            label="Due"
            value={fmtBDT(totals.due)}
            bold
            emphasis={totals.due > 0 ? "warn" : "ok"}
          />
        </dl>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2">
        <div>
          <p className="font-medium text-foreground">Payment method</p>
          <p className="text-muted-foreground">{form.paymentMethod}</p>
        </div>
        <div className="sm:text-right">
          <p className="font-medium text-foreground">Payment status</p>
          <p
            className={
              totals.status === "Paid"
                ? "text-primary"
                : totals.status === "Partial"
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-destructive"
            }
          >
            {totals.status}
          </p>
        </div>
        {form.notes.trim() && (
          <div className="sm:col-span-2">
            <p className="font-medium text-foreground">Notes</p>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {form.notes}
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        Thank you for shopping with {form.shopName || "us"}!
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  emphasis,
}: {
  label: string;
  value: string;
  bold?: boolean;
  emphasis?: "ok" | "warn";
}) {
  const color =
    emphasis === "warn"
      ? "text-destructive"
      : emphasis === "ok"
        ? "text-primary"
        : "text-foreground";
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`tabular-nums ${bold ? "font-semibold" : ""} ${color}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required,
  hint,
  type = "text",
  className,
  placeholder,
  step,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  type?: string;
  className?: string;
  placeholder?: string;
  step?: string;
  min?: number;
}) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {hint && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            ({hint})
          </span>
        )}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        className={
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }
        aria-invalid={!!error}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const printCSS = `
@media print {
  @page { size: A4; margin: 14mm; }
  html, body { background: #ffffff !important; }
  body * { visibility: hidden !important; }
  #invoice-print, #invoice-print * { visibility: visible !important; }
  #invoice-print {
    position: absolute !important;
    left: 0; top: 0;
    width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    color: #000 !important;
    background: #ffffff !important;
  }
  #invoice-print * {
    color: #000 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  #invoice-print table { border-collapse: collapse; width: 100%; }
  #invoice-print thead { display: table-header-group; }
  #invoice-print tr, #invoice-print td, #invoice-print th {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  #invoice-print th, #invoice-print td {
    border-bottom: 1px solid #ccc !important;
    padding: 6px 8px !important;
  }
  .no-print { display: none !important; }
}
`;
