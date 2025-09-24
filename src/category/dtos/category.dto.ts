import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/dtos/product';

export class CategoryDto {
  @ApiProperty({ description: 'ID da categoria', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da categoria', example: 'Eletrônicos' })
  name: string;

  @ApiProperty({ description: 'Lista de produtos da categoria', type: [Product] })
  products: Product[];
}
