"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type CaptureState =
  | { status: "loading" }
  | { status: "success"; orderId: string; totalCents: number; }
  | { status: "error"; message: string };

export function CheckoutSuccessClient({ paypalOrderId }: { paypalOrderId?: string }) {
  const { clear } = useCart();
  const [state, setState] = useState<CaptureState>({ status: "loading" });

  useEffect(() => {
    if (!paypalOrderId) {
      setState({ status: "error", message: "Missing PayPal order reference." });
      return;
    }

    const run = async () => {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paypalOrderId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setState({ status: "error", message: data.error ?? "Unable to verify payment." });
        return;
      }
      clear();
      setState({ status: "success", orderId: data.order.id, totalCents: data.order.totalCents });
    };

    void run();
  }, [clear, paypalOrderId]);

  if (state.status === "loading") {
    return (
      <Card className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
        <p className="text-slate-200">Verifying your PayPal payment and delivering keys…</p>
      </Card>
    );
  }

  if (state.status === "error") {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-white">We couldn&apos;t verify the payment yet</h1>
        <p className="mt-3 text-slate-400">{state.message}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/checkout"><Button>Try again</Button></Link>
          <Link href="/contact"><Button variant="secondary">Contact support</Button></Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-cyan-300" />
      <h1 className="text-3xl font-black text-white">Payment verified</h1>
      <p className="text-slate-300">Order {state.orderId.slice(-8)} is paid. Your authorized keys are now in your inbox.</p>
      <p className="text-lg font-semibold text-cyan-200">Total captured: {formatPrice(state.totalCents)}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/inbox"><Button>Open Inbox</Button></Link>
        <Link href="/dashboard/orders"><Button variant="secondary">View Orders</Button></Link>
      </div>
    </Card>
  );
}
