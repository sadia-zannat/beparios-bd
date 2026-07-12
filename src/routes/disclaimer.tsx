import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/landing/InfoPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — BepariOS BD" },
      {
        name: "description",
        content:
          "BepariOS BD calculator results are estimates, not accounting, tax, financial, legal, courier or business advice.",
      },
      { property: "og:title", content: "Disclaimer — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Estimates only — verify every number and invoice before you rely on it.",
      },
      { property: "og:url", content: "https://bepariosbd.lovable.app/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "https://bepariosbd.lovable.app/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <InfoPage
      title="Disclaimer"
      intro="Please read this before you rely on any number produced by the tools."
    >
      <h2>Estimates, not advice</h2>
      <p>
        All calculator results on BepariOS BD are estimates based on the
        numbers you enter. They are not accounting, tax, financial, legal,
        courier or business advice. For anything that will affect your
        taxes, your books or a binding decision, please check with a
        qualified professional.
      </p>

      <h2>Why real numbers may differ</h2>
      <p>
        Actual profit and loss for your shop can vary from a calculator
        estimate because of factors including:
      </p>
      <ul>
        <li>Returns, refused deliveries and damaged goods.</li>
        <li>Discounts, offers and promo codes.</li>
        <li>Courier charges, COD fees and packaging costs that change over time.</li>
        <li>Advertising performance, seasonality and audience quality.</li>
        <li>Taxes, VAT and other operational costs.</li>
      </ul>

      <h2>Invoices</h2>
      <p>
        Invoice documents produced by the invoice generator are
        user-generated. You are responsible for reviewing every field —
        including business details, customer details, product lines,
        totals, discounts and payment status — before sending an invoice to
        a customer or using it as a business record.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided "as is" without warranty of any kind.
        BepariOS BD is not liable for losses that result from relying on
        calculator outputs or invoice documents without independent
        verification.
      </p>
    </InfoPage>
  );
}
