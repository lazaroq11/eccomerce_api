import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto } from './dtos/orders.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard)
    @Post('checkout')
    @ApiOperation({ summary: 'Criar um novo pedido a partir dos itens selecionados do carrinho' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou cupom expirado' })
    async createOrder(
        @Request() req,
        @Body() createOrderDto: CreateOrderDto,
    ): Promise<OrderResponseDto> {
        return this.ordersService.createOrder(req.user.id, createOrderDto);
    }

    @UseGuards(AuthGuard)
    @Get('my-orders')
    @ApiOperation({ summary: 'Obter os pedidos do usuário logado' })
    @ApiResponse({ status: 200, description: 'Lista de pedidos do usuário', type: [OrderResponseDto] })
    async getMyOrders(@Request() req): Promise<OrderResponseDto[]> {
        return this.ordersService.getOrdersByUser(req.user.id);
    }
}
