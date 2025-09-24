import { Controller, UseGuards, Body, Post, Request, Get, Delete, Patch, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '../auth/auth.guard';
import { CategoryDto } from './dtos/category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @UseGuards(AuthGuard)
    @Post('create')
    @ApiOperation({ summary: 'Cria novas categorias (Admin)' })
    @ApiResponse({ status: 201, description: 'Categorias criadas com sucesso' })
    @ApiBody({ type: [CategoryDto] })
    async createCategory(@Request() request, @Body() body: CategoryDto[]) {
        return this.categoryService.createCategory(body);
    }

    @UseGuards(AuthGuard)
    @Get('all')
    @ApiOperation({ summary: 'Lista todas as categorias' })
    @ApiResponse({ status: 200, description: 'Lista de categorias retornada' })
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Retorna uma categoria pelo ID' })
    @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
    @ApiResponse({ status: 200, description: 'Categoria encontrada' })
    async getCategoryById(@Param('id') id: number) {
        return this.categoryService.getCategoryById(id);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    @ApiOperation({ summary: 'Atualiza uma categoria pelo ID (Admin)' })
    @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
    @ApiBody({ type: CategoryDto })
    async updateCategory(@Request() request, @Param('id') id: number, @Body() body: Partial<CategoryDto>) {
        return this.categoryService.updateCategory(id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    @ApiOperation({ summary: 'Deleta uma categoria pelo ID (Admin)' })
    @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
    async deleteCategory(@Request() request, @Param('id') id: number) {
        return this.categoryService.deleteCategoryById(id);
    }

    @UseGuards(AuthGuard)
    @Delete('deleteAll')
    @ApiOperation({ summary: 'Deleta todas as categorias (Admin)' })
    async deleteAllCategories(@Request() request) {
        return this.categoryService.deteteCategoryAll();
    }
}
