import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto } from './dtos/orders.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(AuthGuard)
    @Post('create')
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order successfully created', type: OrderResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid input or coupon expired' })
    async createOrder(@Request() request, @Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
        return this.ordersService.createOrder(request.user.id, createOrderDto);
    }

    @UseGuards(AuthGuard)
    @Get('my-orders')
    @ApiOperation({ summary: 'Get orders of logged in user' })
    @ApiResponse({ status: 200, description: 'List of user orders', type: [OrderResponseDto] })
    async getMyOrders(@Request() request): Promise<OrderResponseDto[]> {
        return this.ordersService.getOrdersByUser(request.user.id);
    }
}
