import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @UseGuards(AuthGuard)
    @Post('add')
    @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
    @ApiResponse({ status: 201, description: 'Produto adicionado ao carrinho' })
    async addToCart(
        @Request() req,
        @Body() body: { productId: number; quantity: number },
    ) {
        return this.cartService.addToCart(req.user.id, body.productId, body.quantity);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Obter o carrinho do usuário' })
    @ApiResponse({ status: 200, description: 'Carrinho com os produtos' })
    async getCart(@Request() req) {
        return this.cartService.getCartByUserId(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Delete('remove/:productId')
    @ApiOperation({ summary: 'Remover produto do carrinho' })
    @ApiResponse({ status: 200, description: 'Produto removido do carrinho' })
    async removeItem(@Request() req, @Param('productId') productId: string) {
        return this.cartService.removeItemFromCart(req.user.id, Number(productId));
    }

    @UseGuards(AuthGuard)
    @Delete('clear')
    @ApiOperation({ summary: 'Limpar o carrinho' })
    @ApiResponse({ status: 200, description: 'Carrinho limpo com sucesso' })
    async clearCart(@Request() req) {
        return this.cartService.clearCart(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Post('remove-items')
    @ApiOperation({ summary: 'Remover múltiplos produtos do carrinho' })
    @ApiResponse({ status: 200, description: 'Itens selecionados removidos do carrinho' })
    async removeItems(
        @Request() req,
        @Body() body: { productIds: number[] },
    ) {
        return this.cartService.removeItemsFromCart(req.user.id, body.productIds);
    }
}
