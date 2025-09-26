import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "generated/prisma";

export class OrderItemDto {
  @ApiProperty({ description: "Título do item (nome do produto)", example: "Camiseta Preta" })
  title: string;

  @ApiProperty({ description: "ID do produto", example: "prod_123" })
  productId: number;

  @ApiProperty({ description: "Quantidade do item", example: 2 })
  quantity: number;

  @ApiProperty({ description: "Preço unitário em reais", example: 75.5 })
  price: number;

  @ApiProperty({ description: "ID do pedido ao qual pertence", example: "order_123" })
  orderId: number;
}

export class CreateOrderItemDto extends OrderItemDto {}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto], description: "Lista de itens do pedido" })
  items: CreateOrderItemDto[];

  @ApiProperty({ description: "Código do cupom (opcional)", example: "PROMO10", required: false })
  couponCode?: string;

  @ApiProperty({ description: "Nome do comprador", example: "João Silva" })
  buyerName: string;

  @ApiProperty({ description: "Email do comprador", example: "joao@email.com" })
  buyerEmail: string;

  @ApiProperty({ description: "CPF do comprador", example: "123.456.789-00" })
  buyerCpf: string;

  @ApiProperty({ description: "Método de pagamento", example: "pix", enum: ["pix", "boleto", "card"] })
   paymentMethod: PaymentMethod;
}

export class UpdateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto], description: "Itens atualizados", required: false })
  items?: CreateOrderItemDto[];

  @ApiProperty({ description: "Novo cupom (opcional)", example: "PROMO20", required: false })
  couponCode?: string;

  @ApiProperty({ description: "Método de pagamento atualizado", example: "card", enum: ["pix", "boleto", "card"], required: false })
  paymentMethod: PaymentMethod;
}

export class OrderResponseDto {
  @ApiProperty({ description: "ID do pedido", example: 1 })
  id: number;

  @ApiProperty({ description: "ID do usuário", example: 10 })
  userId: number;

  @ApiProperty({ type: [OrderItemDto], description: "Itens do pedido" })
  items: OrderItemDto[];

  @ApiProperty({ description: "Total do pedido em reais", example: 150.75 })
  total: number;

  @ApiProperty({ description: "Total em centavos (para Mercado Pago)", example: 15075 })
  totalInCents: number;

  @ApiProperty({ description: "Status do pedido", example: "PENDING" })
  status: string;

  @ApiProperty({ description: "ID do cupom (se existir)", example: 2, required: false })
  couponId?: number;

  @ApiProperty({ description: "Método de pagamento utilizado", example: "pix", enum: ["pix", "boleto", "card"] })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: "Data de criação do pedido", example: "2025-09-23T16:20:00Z" })
  createdAt: Date;
}
