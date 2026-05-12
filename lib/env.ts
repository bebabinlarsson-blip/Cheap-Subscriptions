export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function isGoogleAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function isPayPalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function isAuthSecretConfigured() {
  return Boolean(process.env.NEXTAUTH_SECRET);
}

export function getStorePurchasedItemsBaseline() {
  // Keep STORE_PURCHASE_BASELINE as legacy fallback to avoid breaking existing deployments.
  const parsed = Number.parseInt(
    process.env.STORE_PURCHASED_ITEMS_BASELINE ?? process.env.STORE_PURCHASE_BASELINE ?? "47",
    10,
  );
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 47;
}
