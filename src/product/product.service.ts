import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './dtos/product';

@Injectable()
export class ProductService {
    constructor(private prismaService: PrismaService) { }
    async createProduct(data: Product[]): Promise<Product[]> {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No products provided');
        }

        for (const prod of data) {
            if (!prod.name || prod.price == null || prod.price <= 0 || !prod.categoryId || prod.stock == null) {
                throw new Error(`Invalid product data for ${prod.name || 'unknown'}`);
            }
        }


        const names = data.map(p => p.name);
        const existingProducts = await this.prismaService.product.findMany({
            where: { name: { in: names } },
        });

        if (existingProducts.length > 0) {
            const existingNames = existingProducts.map(p => p.name).join(', ');
            throw new Error(`Product(s) already exists: ${existingNames}`);
        }


        const createdProducts: Product[] = [];
        for (const prod of data) {
            const created = await this.prismaService.product.create({
                data: {
                    name: prod.name,
                    price: prod.price,
                    stock: prod.stock,
                    categoryId: prod.categoryId,
                    description: prod.description,
                }
            });
            createdProducts.push({
                ...created,
                description: created.description ?? undefined
            });
        }

        return createdProducts.map(prod => ({
            ...prod,
            description: prod.description ?? undefined
        }));
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await this.prismaService.product.findMany();
        return products.map(product => ({
            ...product,
            description: product.description === null ? undefined : product.description
        }));
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.prismaService.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return {
            ...product,
            description: product.description === null ? undefined : product.description
        };
    }

    async updateProduct(id: number, data: Partial<Product>) {
        const product = await this.prismaService.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        if (data.price !== undefined && data.price < 0) {
            throw new Error('Invalid price');
        }
        return this.prismaService.product.update({
            where: { id },
            data,
        });
    }

    async deleteProductById(id: number) {
        await this.prismaService.product.delete({
            where: { id }
        });
    }

    async deleteProductsAll(): Promise<void> {
        await this.prismaService.product.deleteMany();
    }
}
