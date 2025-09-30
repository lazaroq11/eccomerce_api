import { ApiProperty } from "@nestjs/swagger";

export class UpdateStockDto {
  @ApiProperty({ description: "ID do produto", example: 1 })
  productId: number;

  @ApiProperty({ description: "Quantidade a adicionar/remover", example: 10 })
  quantity: number;

  @ApiProperty({ description: "Tipo da movimentação (IN = entrada, OUT = saída)", example: "IN" })
  type: "IN" | "OUT";
}

export class StockHistoryDto {
  @ApiProperty({ description: "ID do histórico", example: 1 })
  id: number;

  @ApiProperty({ description: "ID do produto", example: 1 })
  productId: number;

  @ApiProperty({ description: "Quantidade movimentada", example: 5 })
  quantity: number;

  @ApiProperty({ description: "Tipo da movimentação (IN/OUT)", example: "IN" })
  type: string;

  @ApiProperty({ description: "Data da movimentação", example: "2025-09-30T12:00:00Z" })
  createdAt: Date;
}
