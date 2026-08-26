export interface ProductImage {
  id: number;
  title: string;
  file: string;
  alt: string;
  guid: string;
}

export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock: string;
  excerpt: string;
  description: string;
  categories: CategoryRef[];
  tags: CategoryRef[];
  images: ProductImage[];
  modified: string;
}

export interface Category {
  term_id: number;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  count: number;
  description: string;
}

export interface CartItem {
  productId: number;
  qty: number;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  url: string;
  currency: string;
  whatsapp: Record<string, string>;
}
