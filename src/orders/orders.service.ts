import { Inject, forwardRef, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto, OrderResponseDto, OrderItemDto as OrderItem } from './dtos/orders.dto';
import { OrderStatus } from './enums/order_status.enum';
import { PaymentService } from 'src/payment/payment.service';


@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
  ) { }

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
    const orderItemsData = data.items.map((item) => {
      const product = products.find(p => p.id === item.productId)!;

      if (product.stock < item.quantity) {
        throw new BadRequestException("Insufficient stock for product");
      }

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

    const discountMultiplier = data.couponCode ? 1 - (await this.prismaService.coupon.findUnique({
      where: { code: data.couponCode }
    }))!.discount / 100 : 1;


    const order = await this.prismaService.$transaction(async tx => {
      const newOrder = await tx.order.create({
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

      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            type: 'OUT',
          },
        });
      }

      return newOrder;
    });

    await this.cartService.removeItemsFromCart(userId, productIds);
    const preferenceItems = order.items.map((i) => ({
      id: i.productId.toString(),
      title: i.title,
      description: `Quantidade: ${i.quantity}`,
      quantity: i.quantity,
      unit_price: i.price * discountMultiplier, 
      currency_id: 'BRL',
    }));
    const paymentPreference = await this.paymentService.createPreference({
      orderId: order.id,
      items: preferenceItems,
      payerEmail: (await this.prismaService.user.findUnique({ where: { id: userId } }))!.email,
    });

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
      checkoutUrl: paymentPreference.init_point,
    };
  }


  async cancelOrder(userId: number, orderId: number): Promise<OrderResponseDto> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Not your order');
    if (order.status === 'CANCELLED') throw new BadRequestException('Order already cancelled');
    if (order.status === 'SHIPPED') throw new BadRequestException('Order already shipped and cannot be cancelled');
    const updatedOrder = await this.prismaService.$transaction(async tx => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });

        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            type: 'IN',
          },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
        include: { items: true },
      });
    });

    return {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      items: updatedOrder.items,
      total: updatedOrder.total,
      totalInCents: Math.round(updatedOrder.total * 100),
      status: updatedOrder.status,
      couponId: updatedOrder.couponId ?? undefined,
      paymentMethod: updatedOrder.paymentMethod,
      createdAt: updatedOrder.createdAt,
    };
  }

  async updateOrderStatus(orderId: number, status: string): Promise<OrderResponseDto> {
    const order = await this.prismaService.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new NotFoundException('Order not found');

    const validStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ];

    if (!validStatuses.includes(status as OrderStatus)) throw new BadRequestException('Invalid status');


    const updatedOrder = await this.prismaService.order.update({ where: { id: orderId }, data: { status: status as OrderStatus }, include: { items: true } });
    return this.mapOrderToResponse(updatedOrder);
  }

  private mapOrderToResponse(order: any): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      items: order.items.map(i => ({ productId: i.productId, title: i.title, quantity: i.quantity, price: i.price, orderId: i.orderId })),
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
