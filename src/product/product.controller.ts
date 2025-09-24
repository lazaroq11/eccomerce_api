import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Product } from './dtos/product';
import { CreateProductDto, UpdateProductDto } from './dtos/product';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Cria novos produtos (Admin)' })
  @ApiResponse({ status: 201, description: 'Produtos criados com sucesso' })
  @ApiBody({ type: [CreateProductDto] })
  async createProduct(@Request() request, @Body() body: Product[]) {
    return this.productService.createProduct(body);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @ApiOperation({ summary: 'Lista todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada' })
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retorna um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  async getProductById(@Body('id') id: number) {
    return this.productService.getProductById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  @ApiOperation({ summary: 'Atualiza um produto pelo ID (Admin)' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(
    @Request() request,
    @Body('id') id: number,
    @Body() body: Partial<Product>,
  ) {
    return this.productService.updateProduct(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Deleta um produto pelo ID (Admin)' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  async deleteProduct(@Request() request, @Body('id') id: number) {
    return this.productService.deleteProductById(id);
  }

  @UseGuards(AuthGuard)
  @Delete('all')
  @ApiOperation({ summary: 'Deleta todos os produtos (Admin)' })
  async deleteAllProducts(@Request() request) {
    return this.productService.deleteProductsAll();
  }
}
