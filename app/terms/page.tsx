import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black text-white">Terms of sale</h1>
      <p className="text-slate-300">Premium Tools Mega List only supports the sale of authorized digital licenses, subscriptions, and redemption keys. The owner must confirm legal resale rights before listing any product.</p>
      <ul className="list-disc space-y-2 pl-6 text-slate-400">
        <li>All prices are in EUR and delivered digitally.</li>
        <li>Keys are provided only after server-side payment verification.</li>
        <li>Do not list stolen accounts, cracked software, shared accounts, or unauthorized credentials.</li>
        <li>Brand names and logos remain the property of their respective owners.</li>
      </ul>
    </Card>
  );
}
