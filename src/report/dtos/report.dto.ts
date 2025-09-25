import { ApiProperty } from '@nestjs/swagger';

export class SalesReportDto {
  @ApiProperty({ example: 5000, description: 'Total de vendas no período' })
  totalSales: number;

  @ApiProperty({ example: 150, description: 'Quantidade total de pedidos' })
  totalOrders: number;

  @ApiProperty({ example: 50, description: 'Quantidade de novos clientes' })
  newCustomers: number;

  @ApiProperty({ example: 300, description: 'Quantidade de produtos em estoque' })
  productsInStock: number;
}

export class RevenueByMonthDto {
  @ApiProperty({ example: 'Janeiro', description: 'Mês' })
  month: string;

  @ApiProperty({ example: 10000, description: 'Receita total no mês' })
  revenue: number;
}

export class PopularProductDto {
  @ApiProperty({ example: 'Camiseta Preta', description: 'Nome do produto' })
  name: string;

  @ApiProperty({ example: 200, description: 'Quantidade vendida' })
  sold: number;
}

export class DashboardResponseDto {
  @ApiProperty({ type: SalesReportDto })
  salesReport: SalesReportDto;

  @ApiProperty({ type: [RevenueByMonthDto] })
  revenueByMonth: RevenueByMonthDto[];

  @ApiProperty({ type: [PopularProductDto] })
  popularProducts: PopularProductDto[];
}
