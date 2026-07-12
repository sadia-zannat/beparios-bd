import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — ShopPilot BD" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your ShopPilot BD dashboard."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email or phone</Label>
          <Input
            id="email"
            type="text"
            placeholder="you@shop.com or 017XXXXXXXX"
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" size="lg" asChild>
          <Link to="/dashboard">Log in</Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
