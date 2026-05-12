import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black text-white">Contact</h1>
      <p className="text-slate-300">Add your official support inbox before launch so buyers can request help with delivery, resend requests, refunds, or billing questions.</p>
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm text-cyan-100">
        Suggested support details: support@your-domain.com, business hours, and expected response times.
      </div>
    </Card>
  );
}
