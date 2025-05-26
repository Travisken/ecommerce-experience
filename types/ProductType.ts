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
  price: number;
  rating: number;
  discount: number;
  sales: number;
  review: [];
  itemImages: ProductImageVariants[];
  sizes: string[];
  selectedSize?: string;
  selectedColor?: keyof ProductImageVariants | "";
};

export type CartItem = {
  product: Product;
  quantity: number;
};