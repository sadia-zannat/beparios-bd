import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/landing/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — BepariOS BD" },
      {
        name: "description",
        content:
          "The terms that apply when you use the free BepariOS BD calculators and invoice generator.",
      },
      { property: "og:title", content: "Terms of Use — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Rules and expectations for using the free BepariOS BD seller tools.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPage
      title="Terms of Use"
      intro="By using BepariOS BD you agree to the terms below."
      updated="12 July 2026"
    >
      <h2>Purpose of the tools</h2>
      <p>
        The BepariOS BD calculators and invoice generator are provided for
        informational and estimation purposes only. They are designed to
        help online sellers in Bangladesh think about pricing, profit,
        returns and simple invoices — not to replace professional
        accounting, tax, legal or financial advice.
      </p>

      <h2>Your responsibility</h2>
      <ul>
        <li>
          You are responsible for checking every number you enter and every
          result you rely on, including prices, profit calculations,
          invoices, taxes, courier fees, discounts and refunds.
        </li>
        <li>
          You are responsible for the business decisions you make based on
          the outputs of the tools.
        </li>
        <li>
          You are responsible for the content of invoices you create,
          including customer details and payment terms.
        </li>
      </ul>

      <h2>Availability</h2>
      <p>
        We aim to keep the site available and working, but we do not
        guarantee uninterrupted or error-free availability. Features may
        change, be paused, or be removed as the product evolves.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Misuse, attack, overload, disrupt or attempt to gain unauthorised
          access to the site or the infrastructure it runs on.
        </li>
        <li>
          Scrape the site excessively or automate requests in a way that
          harms availability for other users.
        </li>
        <li>
          Use the tools for anything unlawful or to deceive customers,
          couriers or tax authorities.
        </li>
      </ul>

      <h2>Content and branding</h2>
      <p>
        The BepariOS BD name, design and site content belong to BepariOS BD
        unless clearly stated otherwise. You keep ownership of the data you
        type into the tools and of the invoices you generate for your own
        business.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may be updated as the product changes. The current
        version will always be available on this page with an updated date.
      </p>
    </InfoPage>
  );
}
