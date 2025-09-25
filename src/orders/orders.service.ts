import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, OrderResponseDto, OrderItemDto as OrderItem } from './dtos/orders.dto';
import { CartService } from 'src/cart/cart.service';


@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService, private cartService: CartService) { }

  async createOrder(userId: number, data?: CreateOrderDto): Promise<OrderResponseDto> {
    let items: OrderItem[];
    if (!data?.items || data.items.length === 0) {
      const cart = await this.cartService.getCart(userId);
      if (!cart?.items?.length) throw new BadRequestException('Cart is empty');

      items = cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      }));
    } else {
      items = data.items;
    }
    const productIds = items.map(i => i.productId);
    const products = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      throw new NotFoundException('One or more products not found');
    }
    let total = 0;
    const orderItemsData = items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      total += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    let couponId: number | undefined = undefined;
    if (data?.couponCode) {
      const coupon = await this.prismaService.coupon.findUnique({
        where: { code: data.couponCode },
      });
      if (!coupon) throw new NotFoundException('Coupon not found');
      if (coupon.expiresAt < new Date()) throw new BadRequestException('Coupon expired');

      total = total * (1 - coupon.discount / 100);
      couponId = coupon.id;
    }
    const order = await this.prismaService.$transaction(async prisma => {
      const newOrder = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          couponId,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });
      if (!data?.items || data.items.length === 0) {
        await this.cartService.clearCart(userId);
      }

      return newOrder;
    });
    return {
      id: order.id,
      userId: order.userId,
      items: order.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      total: order.total,
      status: order.status,
      couponId: order.couponId ?? undefined,
      createdAt: order.createdAt,
    };
  }

  async getOrdersByUser(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      include: { items: true }
    });

    return orders.map(order => ({
      id: order.id,
      userId: order.userId,
      items: order.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      total: order.total,
      status: order.status,
      couponId: order.couponId ?? undefined,
      createdAt: order.createdAt
    }));
  }
}
