import { Injectable } from '@nestjs/common';
import { Category } from './dtos/category';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prismaService: PrismaService) { }

    async createCategory(data: Category[]): Promise<Category[]> {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No category provided');
        }

        for (const cat of data) {
            if (!cat.name) {
                throw new Error(`Invalid product data for ${cat.name || 'unknown'}`);
            }
        }

        const names = data.map(p => p.name);
        const existingCategories = await this.prismaService.product.findMany({
            where: { name: { in: names } },
        });

        if (existingCategories.length > 0) {
            const existingNames = existingCategories.map(p => p.name).join(', ');
            throw new Error(`Product(s) already exists: ${existingNames}`);
        }

        const createdCategory: Category[] = [];
        for (const cat of data) {
            const created = await this.prismaService.category.create({
                data: {
                    name: cat.name,
                }
            });
            createdCategory.push({
            id: created.id,
            name: created.name,
            products: [], // inicialmente vazio
        });


        }

        return createdCategory;
    }

    async getAllCategories(): Promise<Category[]> {
        const categories = await this.prismaService.category.findMany({
            include: { products: true }
        });
        return categories.map(category => ({
            ...category,
            products: category.products.map(product => ({
                ...product,
                description: product.description === null ? undefined : product.description
            }))
        }));
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: { products: true }
        });
        if (!category) {
            throw new Error('Category not found');
        }
        return {
            ...category,
            products: category.products.map(product => ({
                ...product,
                description: product.description === null ? undefined : product.description
            }))
        };
    }

    async updateCategory(id: number, data: Partial<Category>) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new Error('Category not found');
        }
        if (data.name && data.name.trim() === '') {
            throw new Error('Category name cannot be empty');
        }
        const { id: _id, products, ...updateData } = data;
        return this.prismaService.category.update({
            where: { id },
            data: updateData
        });
    }

    async deleteCategoryById(id: number) {
        const category = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!category) {
            throw new Error('Category not found');
        }
        return this.prismaService.category.delete({
            where: { id }
        });
    }

    async deteteCategoryAll(): Promise<void> {
        await this.prismaService.category.deleteMany();
    }

}