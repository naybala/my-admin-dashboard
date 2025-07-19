export interface Product {
  id?: number;
  name: string;
  categoryId: number;
  description: string;
  images: string[];
  imageFiles: File[];
  imageUrls: string[];
}

export interface ProductIndex{
  id?: number;
  name: string;
  price: number;
  category: string;
  description: string;
  data:any;
}

export interface Category {
  id?: number;
  name: string;
  description: string;
}
