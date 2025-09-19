export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
}