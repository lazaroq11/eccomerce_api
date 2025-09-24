import { Controller, UseGuards, Get, Post, Delete, Patch, Request, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @UseGuards(AuthGuard)
    @Post('add')
    @ApiOperation({ summary: 'Adiciona um item ao carrinho' })
    @ApiBody({ schema: { type: 'object', properties: { productId: { type: 'number', example: 1 }, quantity: { type: 'number', example: 2 } } } })
    @ApiResponse({ status: 201, description: 'Item adicionado ao carrinho' })
    async addToCart(@Request() request, @Body() body: { productId: number; quantity: number }) {
        const userId = request.user.id;
        return this.cartService.addToCart(userId, body.productId, body.quantity);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Retorna os itens do carrinho do usuário logado' })
    @ApiResponse({ status: 200, description: 'Itens do carrinho retornados com sucesso' })
    async getCart(@Request() request) {
        const userId = request.user.id;
        return this.cartService.getCart(userId);
    }

    @UseGuards(AuthGuard)
    @Delete('item/:productId')
    @ApiOperation({ summary: 'Remove um item específico do carrinho' })
    @ApiParam({ name: 'productId', description: 'ID do produto a ser removido', example: 1 })
    @ApiResponse({ status: 200, description: 'Item removido do carrinho' })
    async removeItemFromCart(@Request() request, @Param('productId') productId: string) {
        const userId = request.user.id;
        return this.cartService.removeItemFromCart(userId, Number(productId));
    }

    @UseGuards(AuthGuard)
    @Delete('all')
    @ApiOperation({ summary: 'Remove todos os itens do carrinho do usuário logado' })
    @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
    async clearCart(@Request() request) {
        const userId = request.user.id;
        return this.cartService.clearCart(userId);
    }
}
