import { Controller, UseGuards, Body, Post, Get, Delete, Patch, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Product } from './dtos/product';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @UseGuards(AuthGuard)
    @Post('create')
    async createProduct(@Request() request, @Body() body: Product[]) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can create products');
        }
        return this.productService.createProduct(body);
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getProductById(@Body('id') id: number) {
        return this.productService.getProductById(id);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async updateProduct(@Request() request, @Body('id') id: number, @Body() body: Partial<Product>) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can update products');
        }
        return this.productService.updateProduct(id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async deleteProduct(@Request() request, @Body('id') id: number) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can delete products');
        }
        return this.productService.deleteProductById(id);
    }

    @UseGuards(AuthGuard)
    @Delete('deleteAll')
    async deleteAllProducts(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can delete products');
        }
        return this.productService.deleteProductsAll();
    }
}

