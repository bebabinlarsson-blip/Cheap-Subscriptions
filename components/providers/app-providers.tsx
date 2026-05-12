import type { Session } from "next-auth";

import { CartProvider } from "@/components/providers/cart-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export function AppProviders({ children, session }: { children: React.ReactNode; session: Session | null; }) {
  return (
    <AuthSessionProvider session={session}>
      <CartProvider>{children}</CartProvider>
    </AuthSessionProvider>
  );
}
