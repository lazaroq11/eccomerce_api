import { Controller, Get, Post, Body, Request, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto } from './dtos/orders.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Pedidos')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(AuthGuard)
    @Post('checkout')
    @ApiOperation({ summary: 'Criar um novo pedido a partir dos itens selecionados do carrinho' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou cupom expirado' })
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
        return this.ordersService.createOrder(req.user.id, createOrderDto);
    }

    @UseGuards(AuthGuard)
    @Get('my-orders')
    @ApiOperation({ summary: 'Obter os pedidos do usuário logado' })
    @ApiResponse({ status: 200, description: 'Lista de pedidos do usuário', type: [OrderResponseDto] })
    async getMyOrders(@Request() req): Promise<OrderResponseDto[]> {
        return this.ordersService.getOrdersByUser(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Patch('cancel/:id')
    @ApiOperation({ summary: 'Cancelar um pedido pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do pedido a ser cancelado' })
    @ApiResponse({ status: 200, description: 'Pedido cancelado com sucesso', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Pedido não pode ser cancelado' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
    async cancelOrder(@Request() req, @Param('id', ParseIntPipe) orderId: number): Promise<OrderResponseDto> {
        return this.ordersService.cancelOrder(req.user.id, orderId);
    }

    @UseGuards(AuthGuard)
    @Patch('status/:id')
    @ApiOperation({ summary: 'Atualizar o status de um pedido pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do pedido a ser atualizado' })
    @ApiResponse({ status: 200, description: 'Status atualizado com sucesso', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Status inválido' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
    async updateOrderStatus(@Param('id', ParseIntPipe) orderId: number, @Body('status') status: string): Promise<OrderResponseDto> {
        return this.ordersService.updateOrderStatus(orderId, status);
    }
}
