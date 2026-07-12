import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/landing/InfoPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — BepariOS BD" },
      {
        name: "description",
        content:
          "BepariOS BD currently offers free public tools with no paid subscription, so refunds are not applicable today.",
      },
      { property: "og:title", content: "Refund Policy — BepariOS BD" },
      {
        property: "og:description",
        content:
          "No paid product is currently offered, so refunds do not apply. A revised policy will be published before paid services launch.",
      },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <InfoPage
      title="Refund Policy"
      intro="What refunds look like on the current free MVP."
      updated="12 July 2026"
    >
      <h2>Current status</h2>
      <p>
        BepariOS BD currently provides free public tools — a set of
        calculators and a simple invoice generator. There is no paid
        subscription, one-time purchase or in-app payment on the site
        today.
      </p>

      <h2>Are refunds available?</h2>
      <p>
        Because nothing is sold on BepariOS BD at the moment, refunds are
        not applicable. If you were charged by anyone claiming to sell
        BepariOS BD access, please contact us at{" "}
        <a href="mailto:sadiazannat535@gmail.com">sadiazannat535@gmail.com</a>{" "}
        so we can look into it.
      </p>

      <h2>Before paid services launch</h2>
      <p>
        A full refund and billing policy will be published on this page
        before any paid plan, subscription or purchasable feature is made
        available. Nothing on the site will be charged for until that
        happens.
      </p>
    </InfoPage>
  );
}
