import { ApiProperty } from "@nestjs/swagger";

export class CreateCouponDto {
  @ApiProperty({ description: 'Código do cupom', example: 'PROMO10' })
  code: string;

  @ApiProperty({ description: 'Desconto do cupom em %', example: 10 })
  discount: number;

  @ApiProperty({ description: 'Data de expiração do cupom', example: '2025-12-31' })
  expirationDate: Date;
}

export class UpdateCouponDto {
  @ApiProperty({ description: 'Código do cupom', example: 'PROMO10', required: false })
  code?: string;

  @ApiProperty({ description: 'Desconto do cupom em %', example: 10, required: false })
  discount?: number;

  @ApiProperty({ description: 'Data de expiração do cupom', example: '2025-12-31', required: false })
  expirationDate?: Date;
}

export class CouponResponseDto {
  @ApiProperty({ description: 'ID do cupom', example: 1 })
  id: number;

  @ApiProperty({ description: 'Código do cupom', example: 'PROMO10' })
  code: string;

  @ApiProperty({ description: 'Desconto do cupom em %', example: 10 })
  discount: number;

  @ApiProperty({ description: 'Data de expiração do cupom', example: '2025-12-31' })
  expirationDate: Date;

  @ApiProperty({ description: 'Lista de pedidos associados ao cupom', type: () => [Number] })
  orderIds: number[];
}
