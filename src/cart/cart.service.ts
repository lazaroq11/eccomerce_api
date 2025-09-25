import { Injectable, NotFoundException } from '@nestjs/common';
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

        const existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            await this.prismaService.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await this.prismaService.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        return this.getCartByUserId(userId);
    }

    async getCartByUserId(userId: number) {
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart) {
            return { message: 'Cart is empty', items: [] };
        }

        return {
            id: cart.id,
            userId: cart.userId,
            createdAt: cart.createdAt,
            items: cart.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    description: item.product.description ?? undefined,
                    stock: item.product.stock,
                    createdAt: item.product.createdAt,
                    updatedAt: item.product.updatedAt,
                    categoryId: item.product.categoryId,
                },
            })),
        };
    }

    async removeItemFromCart(userId: number, productId: number) {
        const cart = await this.prismaService.cart.findUnique({ where: { userId } });
        if (!cart) throw new NotFoundException('Cart not found');

        await this.prismaService.cartItem.deleteMany({
            where: { cartId: cart.id, productId },
        });

        return this.getCartByUserId(userId);
    }

    async removeItemsFromCart(userId: number, productIds: number[]) {
        const cart = await this.prismaService.cart.findUnique({ where: { userId } });
        if (!cart) throw new NotFoundException('Cart not found');

        await this.prismaService.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId: { in: productIds },
            },
        });

        return this.getCartByUserId(userId);
    }

    async clearCart(userId: number) {
        const cart = await this.prismaService.cart.findUnique({ where: { userId } });
        if (!cart) throw new NotFoundException('Cart not found');

        await this.prismaService.cartItem.deleteMany({ where: { cartId: cart.id } });

        return { message: 'Cart cleared successfully', items: [] };
    }
}
