"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, truncateKey } from "@/lib/utils";

type InboxMessageView = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date | string;
};

type DeliveredKey = {
  id: string;
  keyValue: string;
  soldAt?: Date | string | null;
  createdAt: Date | string;
  product: {
    name: string;
    duration?: string | null;
  };
  order?: {
    id: string;
  } | null;
};

export function InboxClient({ messages, keys }: { messages: InboxMessageView[]; keys: DeliveredKey[] }) {
  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="text-3xl font-black text-white">Inbox delivery center</h1>
        <p className="text-slate-400">Only you can view the keys assigned to your paid orders.</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">No inbox messages yet.</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{message.title}</h3>
                  <span className={`rounded-full px-2 py-1 text-xs ${message.read ? "bg-white/5 text-slate-400" : "bg-cyan-400/10 text-cyan-200"}`}>
                    {message.read ? "Read" : "Unread"}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">{message.body}</p>
                <p className="mt-3 text-xs text-slate-500">{formatDate(message.createdAt)}</p>
              </div>
            ))
          )}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Delivered keys</h2>
          {keys.length === 0 ? (
            <p className="text-sm text-slate-400">Paid keys will appear here after successful PayPal verification.</p>
          ) : (
            keys.map((key) => (
              <div key={key.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{key.product.name}</h3>
                    <p className="text-sm text-slate-400">{key.product.duration ?? "Digital license"}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">Order #{key.order?.id.slice(-8)}</p>
                  </div>
                  <Button variant="secondary" onClick={() => navigator.clipboard.writeText(key.keyValue)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy key
                  </Button>
                </div>
                <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 font-mono text-sm text-cyan-100">
                  <span className="sm:hidden">{truncateKey(key.keyValue)}</span>
                  <span className="hidden sm:inline">{key.keyValue}</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Redeem according to the platform instructions for your authorized license. Purchase date: {formatDate(key.soldAt ?? key.createdAt)}</p>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
