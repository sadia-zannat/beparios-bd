import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — ShopPilot BD" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your business profile and preferences."
      />

      <Card>
        <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Shop name" defaultValue="Kotha Boutique" />
          <Field label="Owner name" defaultValue="Farzana Islam" />
          <Field label="Phone" defaultValue="01717-990022" />
          <Field label="Email" defaultValue="farzana@kotha.shop" type="email" />
          <div className="sm:col-span-2">
            <Field label="Address" defaultValue="Road 11, Banani, Dhaka" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            label="Low stock alerts"
            description="Get notified when a product falls below its threshold."
            defaultChecked
          />
          <Separator />
          <ToggleRow
            label="Daily sales summary"
            description="Email me a snapshot every night at 9 PM."
            defaultChecked
          />
          <Separator />
          <ToggleRow
            label="COD reminders"
            description="Ping me for parcels on courier for more than 5 days."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Currency & region</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Currency" defaultValue="Bangladeshi Taka (৳ BDT)" readOnly />
          <Field label="Timezone" defaultValue="Asia/Dhaka (GMT+6)" readOnly />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
