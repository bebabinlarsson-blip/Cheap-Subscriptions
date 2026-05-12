import { Card } from "@/components/ui/card";

export default function RefundPolicyPage() {
  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black text-white">Refund policy</h1>
      <p className="text-slate-300">Refund rules should comply with local law, PayPal policy, and the owner&apos;s authorized reseller agreements.</p>
      <ul className="list-disc space-y-2 pl-6 text-slate-400">
        <li>Investigate failed delivery or invalid key claims quickly.</li>
        <li>Record refunds in the admin dashboard and in PayPal.</li>
        <li>For digital goods, published refund conditions should be visible before purchase.</li>
      </ul>
    </Card>
  );
}
