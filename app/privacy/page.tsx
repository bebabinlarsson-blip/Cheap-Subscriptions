import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black text-white">Privacy policy</h1>
      <p className="text-slate-300">The store keeps account, order, inbox, and key delivery records needed to provide digital fulfillment and customer support.</p>
      <ul className="list-disc space-y-2 pl-6 text-slate-400">
        <li>Google login is used for sign-in.</li>
        <li>Payment details are verified through PayPal and are not trusted from the browser.</li>
        <li>Only the purchasing user and the owner can access relevant order information.</li>
      </ul>
    </Card>
  );
}
