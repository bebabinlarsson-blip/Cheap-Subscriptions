import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black text-white">Checkout cancelled</h1>
      <p className="text-slate-300">No keys were delivered. Your reserved stock will be released automatically if the payment is not completed.</p>
      <div className="flex gap-3">
        <Link href="/cart"><Button>Return to cart</Button></Link>
        <Link href="/products"><Button variant="secondary">Continue browsing</Button></Link>
      </div>
    </Card>
  );
}
