import { Product } from '../../product/dtos/product';

export interface Category {
    id: number;
    name: string;
    products: Product[];
}