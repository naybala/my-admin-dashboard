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

export interface Role {
  id?: number;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface RoleIndex {
  id?: number;
  name: string;
  description: string | null;
  permissions: string[];
}


export interface User {
  id?: number;
  name: string;
  email: string | null;
  roleId: number | null; 
  password: string;
}

export interface UserIndex {
  id?: number;
  name: string;
  email: string | null;
}