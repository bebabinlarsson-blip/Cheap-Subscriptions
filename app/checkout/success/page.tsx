import { CheckoutSuccessClient } from "@/components/store/checkout-success-client";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  return <CheckoutSuccessClient paypalOrderId={params.token} />;
}
