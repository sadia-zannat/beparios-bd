import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/landing/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BepariOS BD" },
      {
        name: "description",
        content:
          "BepariOS BD is a free suite of calculators and invoice tools for online sellers in Bangladesh, independently developed as a practical SaaS project.",
      },
      { property: "og:title", content: "About — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Free seller tools for Bangladesh, independently built as a SaaS and portfolio project.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InfoPage
      title="About BepariOS BD"
      intro="Free seller tools built for the reality of running a small online shop in Bangladesh."
    >
      <h2>What BepariOS BD is today</h2>
      <p>
        BepariOS BD is a small collection of free web tools for online sellers
        in Bangladesh — a COD profit calculator, a product pricing calculator,
        a Facebook ads break-even calculator, a return loss calculator and a
        simple BDT invoice generator. Everything on the public site runs
        locally in your browser and is free to use.
      </p>

      <h2>The private business dashboard</h2>
      <p>
        The seller dashboard shown on the landing page (orders, customers,
        products, expenses and reports) is currently a design demo and a
        planned product. The screens use placeholder demo data so you can see
        how the workspace is meant to feel. Live data, accounts and syncing
        are not yet available.
      </p>

      <h2>Who builds it</h2>
      <p>
        BepariOS BD is independently developed as a practical SaaS and
        portfolio project. It is not backed by any brand, courier or platform,
        and it does not claim existing paying customers, revenue or
        commercial partnerships. The goal is simple: build genuinely useful
        tools for Bangladeshi sellers and grow the product honestly from
        there.
      </p>

      <h2>Get in touch</h2>
      <p>
        Feedback, bug reports and feature ideas are very welcome. You can
        reach out via the <a href="/contact">contact page</a>.
      </p>
    </InfoPage>
  );
}
