export interface Product {
  id?: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
}

export interface Category {
  id?: number;
  name: string;
  description: string;
}