export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  duration: string | null;
  priceCents: number | null;
  currency: string;
  logoKey: string;
  active: boolean;
  comingSoon: boolean;
  stockCount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CartItemInput = {
  productId: string;
  quantity: number;
};
