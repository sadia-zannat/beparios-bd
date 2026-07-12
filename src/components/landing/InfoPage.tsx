import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
};

export function InfoPage({ title, intro, updated, children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {intro}
            </p>
          )}
          {updated && (
            <p className="mt-3 text-xs text-muted-foreground">
              Last updated: {updated}
            </p>
          )}
        </div>
      </section>
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6 px-4 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:text-base [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:sm:text-xl [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
          {children}
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
