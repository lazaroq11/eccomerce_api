import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService) { }

    async addToCart(userId: number, productId: number, quantity: number) {
        let cart = await this.prismaService.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            cart = await this.prismaService.cart.create({
                data: { userId },
                include: { items: true },
            });

        }

        const existingItem = cart!.items.find(item => item.productId === productId);
        if (existingItem) {
            return this.prismaService.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }


        return this.prismaService.cartItem.create({
            data: {
                cartId: cart!.id,
                productId,
                quantity,
            },
        });
    }

    async getCart(userId: number) {
        let cart = await this.prismaService.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart) {
            return null;
        }

        return {
            ...cart,
            items: cart.items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    description: item.product.description === null ? undefined : item.product.description,
                },
            })),
        };
    }

    async removeItemFromCart(userId: number, productId: number) {
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },

        });
        if (!cart) {
            throw new Error('Cart not found');
        }
        this.prismaService.cartItem.deleteMany({
            where: { cartId: cart.id, productId },
        });
        return { message: 'Item removed from cart successfully' };
    }

    async clearCart(userId: number) {
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            throw new Error('Cart not found');
        }

        await this.prismaService.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return { message: 'Cart cleared successfully' }
    }
}
