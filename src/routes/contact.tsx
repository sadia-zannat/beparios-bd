import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { InfoPage } from "@/components/landing/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — BepariOS BD" },
      {
        name: "description",
        content:
          "Get in touch with BepariOS BD about the free seller tools, feedback, bug reports or feature ideas.",
      },
      { property: "og:title", content: "Contact — BepariOS BD" },
      {
        property: "og:description",
        content:
          "Reach BepariOS BD by email for feedback, bug reports and feature requests.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InfoPage
      title="Contact"
      intro="Questions, feedback, bug reports or ideas for a new calculator — email is the fastest way to reach us."
    >
      <h2>Email</h2>
      <p>
        Write to us at{" "}
        <a href="mailto:sadiazannat535@gmail.com">
          sadiazannat535@gmail.com
        </a>
        . Please include a short description of what you were trying to do
        and, if it's a bug, which tool and browser you used.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-md border border-border bg-muted/40 p-4">
        <Mail className="h-5 w-5 flex-none text-primary" />
        <a
          href="mailto:sadiazannat535@gmail.com"
          className="break-all text-sm font-medium text-foreground"
        >
          sadiazannat535@gmail.com
        </a>
      </div>

      <h2>What we can help with</h2>
      <ul>
        <li>Questions about how a calculator works or what a field means.</li>
        <li>Bug reports and issues with the free tools or the invoice generator.</li>
        <li>Ideas for new calculators or improvements.</li>
        <li>General feedback about the product.</li>
      </ul>

      <p>
        BepariOS BD is a small, independent project, so replies may take a
        little time. Thanks for your patience.
      </p>
    </InfoPage>
  );
}
