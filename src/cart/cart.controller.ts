import { Controller, UseGuards, Get, Post, Delete, Patch, Request, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @UseGuards(AuthGuard)
    @Post('add')
    async addToCart(@Request() request, @Body() body: { productId: number; quantity: number }) {
        const userId = request.user.id;
        return this.cartService.addToCart(userId, body.productId, body.quantity);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getCart(@Request() request) {
        const userId = request.user.id;
        return this.cartService.getCart(userId);
    }

    @UseGuards(AuthGuard)
    @Delete('item/:productId')
    async removeItemFromCart(@Request() request, @Param('productId') productId: string) {
        const userId = request.user.id;
        return this.cartService.removeItemFromCart(userId, Number(productId));
    }

    @UseGuards(AuthGuard)
    @Delete('all')
    async clearCart(@Request() request) {

        const userId = request.user.id;
        return this.cartService.clearCart(userId);
    }
}
