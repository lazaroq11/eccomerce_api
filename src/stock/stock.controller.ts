import { Controller, Post, Body, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { StockService } from "./stock.service";
import { UpdateStockDto, StockHistoryDto } from "./dtos/stock.dto";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("Stock")
@ApiBearerAuth()
@Controller("stock")
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseGuards(AuthGuard)
  @Post("update")
  @ApiOperation({ summary: "Atualizar estoque manualmente (apenas admin)" })
  @ApiResponse({ status: 201, description: "Movimentação registrada", type: StockHistoryDto })
  async updateStock(@Body() dto: UpdateStockDto): Promise<StockHistoryDto> {
    return this.stockService.updateStock(dto);
  }

  @UseGuards(AuthGuard)
  @Get("history")
  @ApiOperation({ summary: "Listar histórico de movimentações de estoque" })
  @ApiResponse({ status: 200, description: "Lista de movimentações", type: [StockHistoryDto] })
  async getHistory(@Query("productId") productId?: number): Promise<StockHistoryDto[]> {
    return this.stockService.getStockHistory(productId ? Number(productId) : undefined);
  }
}
