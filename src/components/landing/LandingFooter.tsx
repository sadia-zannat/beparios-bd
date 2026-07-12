import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export function LandingFooter() {
  const cols = [
    {
      title: "Product",
      items: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "How it works", href: "/#how" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Refund policy", href: "#" },
      ],
    },
  ];
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Free seller tools and business management for Bangladesh's online sellers.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3 text-sm font-semibold">{c.title}</h4>
              <ul className="space-y-2">
                {c.items.map((i) => (
                  <li key={i.label}>
                    <a
                      href={i.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {i.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} BepariOS BD. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link to="/signup" className="hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
