// types/ProductType.ts

export type ProductImageVariants = {
  red: string[];
  blue: string[];
  green: string[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  rating: number;
  discount: number;
  sales: number;
  review: [];
  itemImages: ProductImageVariants[];
  sizes: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};