import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — BepariOS BD" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email linked to your account and we'll send you a reset link."
      footer={
        <>
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@shop.com"
            autoComplete="email"
            required
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
