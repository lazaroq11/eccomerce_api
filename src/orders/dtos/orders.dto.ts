import { ApiProperty } from "@nestjs/swagger";
export class OrderItemDto {
  @ApiProperty({ description: "ID do produto", example: 5 })
  productId: number;

  @ApiProperty({ description: "Quantidade do produto", example: 2 })
  quantity: number;
}
export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: "Lista de itens do pedido" })
  items: OrderItemDto[];

  @ApiProperty({ description: "Código do cupom (opcional)", example: "PROMO10", required: false })
  couponCode?: string;
}

export class UpdateOrderDto {
  @ApiProperty({ type: [OrderItemDto], required: false, description: "Itens atualizados" })
  items?: OrderItemDto[];

  @ApiProperty({ description: "Novo cupom (opcional)", example: "PROMO20", required: false })
  couponCode?: string;
}

export class OrderResponseDto {
  @ApiProperty({ description: "ID do pedido", example: 1 })
  id: number;

  @ApiProperty({ description: "ID do usuário", example: 10 })
  userId: number;

  @ApiProperty({ type: [OrderItemDto], description: "Itens do pedido" })
  items: OrderItemDto[];

  @ApiProperty({ description: "Total do pedido", example: 150.75 })
  total: number;

  @ApiProperty({ description: "Status do pedido", example: "PENDING" })
  status: string;

  @ApiProperty({ description: "ID do cupom (se existir)", example: 2, required: false })
  couponId?: number;

  @ApiProperty({ description: "Data de criação do pedido", example: "2025-09-23T16:20:00Z" })
  createdAt: Date;
}
