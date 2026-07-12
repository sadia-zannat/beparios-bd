import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto w-full max-w-md py-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BepariOS BD
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,color-mix(in_oklab,white_18%,transparent)_0%,transparent_70%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div />
          <div>
            <blockquote className="text-2xl font-semibold leading-snug">
              "BepariOS BD replaced 4 Excel sheets and a notebook. My profit
              actually makes sense now."
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold">Farzana Islam</p>
              <p className="text-sm opacity-80">Owner, Kotha Boutique · Dhaka</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Link to="/" className="hover:opacity-100">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
