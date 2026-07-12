import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/landing/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BepariOS BD" },
      {
        name: "description",
        content:
          "How BepariOS BD handles data for its free public calculators and invoice generator. Tools run locally in your browser.",
      },
      { property: "og:title", content: "Privacy Policy — BepariOS BD" },
      {
        property: "og:description",
        content:
          "The BepariOS BD free tools run locally in your browser and don't intentionally upload calculator or invoice data.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      intro="This policy describes how BepariOS BD handles data on the current public MVP."
      updated="12 July 2026"
    >
      <h2>Scope</h2>
      <p>
        This policy covers the public BepariOS BD website and its free
        calculators and invoice generator. It does not describe any future
        paid product, account system or backend service. The policy will be
        updated before any such feature is introduced.
      </p>

      <h2>How the free tools handle your inputs</h2>
      <ul>
        <li>
          The public calculators and the invoice generator run locally in
          your browser.
        </li>
        <li>
          The numbers, product lines, business and customer details you type
          into the tools are not intentionally uploaded to BepariOS BD and
          are not permanently stored by us.
        </li>
        <li>
          When you refresh or close the page, the data in the form is
          discarded from memory.
        </li>
      </ul>

      <h2>Hosting and technical logs</h2>
      <p>
        The site is delivered by a third-party hosting and content-delivery
        platform. That infrastructure may process basic technical
        information such as the URL requested, timestamp, IP address and
        user-agent for security, abuse-prevention and reliability purposes.
        BepariOS BD does not use these logs to build a profile of you.
      </p>

      <h2>Cookies, analytics and advertising</h2>
      <p>
        The current MVP does not use payment processing, advertising
        cookies, marketing pixels or third-party website analytics. If we
        add analytics or advertising later, this policy will be updated
        first.
      </p>

      <h2>Please avoid sensitive information</h2>
      <p>
        Because the tools are meant for quick estimates and invoice drafts,
        please do not enter highly sensitive personal or financial
        information (for example national ID numbers, full card details,
        bank passwords or health data) into any field.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        This policy may be updated when backend features, user accounts,
        analytics, advertising or payment processing are introduced. Any
        updated version will be published on this page with a new "Last
        updated" date.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions can be sent to{" "}
        <a href="mailto:sadiazannat535@gmail.com">sadiazannat535@gmail.com</a>.
      </p>
    </InfoPage>
  );
}
