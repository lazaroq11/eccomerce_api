import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto, OrderResponseDto, OrderItemDto as OrderItem } from './dtos/orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: number, data: CreateOrderDto): Promise<OrderResponseDto> {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('No items provided');
    }

    const productIds = data.items.map(i => i.productId);
    const products = await this.prismaService.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== data.items.length) {
      throw new NotFoundException('One or more products not found');
    }

    let total = 0;
    const orderItemsData = data.items.map((item: OrderItem) => {
      const product = products.find(p => p.id === item.productId)!;
      total += product.price * item.quantity;
      return {
        productId: item.productId,
        title: product.name, 
        quantity: item.quantity,
        price: product.price,
      };
    });

    let couponId: number | undefined;
    if (data.couponCode) {
      const coupon = await this.prismaService.coupon.findUnique({
        where: { code: data.couponCode },
      });
      if (!coupon) throw new NotFoundException('Coupon not found');
      if (coupon.expiresAt < new Date()) throw new BadRequestException('Coupon expired');

      total *= 1 - coupon.discount / 100;
      couponId = coupon.id;
    }

    const order = await this.prismaService.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        couponId,
        items: { create: orderItemsData },
        paymentMethod: data.paymentMethod ?? 'pix',
      },
      include: { items: true },
    });

    await this.cartService.removeItemsFromCart(userId, productIds);

    return {
      id: order.id,
      userId: order.userId,
      items: order.items.map(i => ({
        productId: i.productId,
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        orderId: i.orderId,
      })),
      total: order.total,
      totalInCents: Math.round(order.total * 100),
      status: order.status,
      couponId: order.couponId ?? undefined,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    };
  }

  async getOrdersByUser(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.prismaService.order.findMany({
      where: { userId },
      include: { items: true },
    });

    return orders.map(order => ({
      id: order.id,
      userId: order.userId,
      items: order.items.map(i => ({
        productId: i.productId,
        title: i.title,
        quantity: i.quantity,
        price: i.price,
        orderId: i.orderId,
      })),
      total: order.total,
      totalInCents: Math.round(order.total * 100),
      status: order.status,
      couponId: order.couponId ?? undefined,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    }));
  }
}
