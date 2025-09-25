import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ description: 'ID do produto', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do produto', example: 'Smartphone' })
  name: string;

  @ApiProperty({ description: 'Descrição do produto', example: 'Produto top de linha', required: false })
  description?: string;

  @ApiProperty({ description: 'Preço do produto', example: 1999.99 })
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 50 })
  stock: number;

  @ApiProperty({ description: 'Imagem do produto', example:"https://placehold.co/400"})
  imageUrl: string | null;

  @ApiProperty({ description: 'ID da categoria do produto', example: 1 })
  categoryId: number;

  @ApiProperty({ description: 'Data de criação', example: '2025-09-23T22:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2025-09-23T22:00:00.000Z' })
  updatedAt: Date;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Smartphone' })
  name: string;

  @ApiProperty({ description: 'Descrição do produto', example: 'Produto top de linha', required: false })
  description?: string;

  @ApiProperty({ description: 'Preço do produto', example: 1999.99 })
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 50 })
  stock: number;

  @ApiProperty({ description: 'ID da categoria do produto', example: 1 })
  categoryId: number;
}

export class UpdateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Smartphone', required: false })
  name?: string;

  @ApiProperty({ description: 'Descrição do produto', example: 'Produto top de linha', required: false })
  description?: string;

  @ApiProperty({ description: 'Preço do produto', example: 1999.99, required: false })
  price?: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 50, required: false })
  stock?: number;

  @ApiProperty({ description: 'ID da categoria do produto', example: 1, required: false })
  categoryId?: number;
}
