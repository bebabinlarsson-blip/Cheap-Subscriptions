import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card className="space-y-4 text-center">
      <h1 className="text-4xl font-black text-white">Page not found</h1>
      <p className="text-slate-400">The neon trail ended here.</p>
      <Link href="/"><Button>Return home</Button></Link>
    </Card>
  );
}
