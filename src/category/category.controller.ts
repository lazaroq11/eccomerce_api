import { Controller, UseGuards, Body, Post, Request, Get, Delete, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Category } from './dtos/category';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @UseGuards(AuthGuard)
    @Post('create')
    async createCategory(@Request() request, @Body() body: Category[]) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can create categories');
        }
        return this.categoryService.createCategory(body);
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getCategoryById(@Body('id') id: number) {
        return this.categoryService.getCategoryById(id);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async updateCategory(@Request() request, @Body('id') id: number, @Body() body: Partial<Category>) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can update categories');
        }
        return this.categoryService.updateCategory(id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async deleteCategory(@Request() request, @Body('id') id: number) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can delete categories');
        }
        return this.categoryService.deleteCategoryById(id);
    }

    @UseGuards(AuthGuard)
    @Delete('deleteAll')
    async deleteAllCategories(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new Error('Access denied: only admins can delete categories');
        }
        return this.categoryService.deteteCategoryAll();
    }


}
