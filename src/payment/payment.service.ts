import { Inject, forwardRef, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from 'src/orders/dtos/orders.dto';
import { PaymentResponseDto } from './dtos/payment.dto';
import { OrderStatus } from '../orders/enums/order_status.enum';
import { PaymentMethod, PaymentStatus } from 'generated/prisma'; 

@Injectable()
export class PaymentService {
    private mercadoPagoPreference: Preference;
    constructor(
        private prismaService: PrismaService,
        @Inject(forwardRef(() => OrdersService))
        private ordersService: OrdersService,
    ) {
        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error('MERCADO_PAGO_ACCESS_TOKEN environment variable is not set.');
        }
        const mercadoPagoConfig = new MercadoPagoConfig({ accessToken });
        this.mercadoPagoPreference = new Preference(mercadoPagoConfig);
    }

    async createOrderAndPreference(
        userId: number,
        items: { productId: number; quantity: number }[],
        paymentMethod: PaymentMethod = PaymentMethod.pix,
        couponCode?: string,
    ): Promise<PaymentResponseDto> {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error(`Usuário com id ${userId} não encontrado.`);

        const productRecords = await this.prismaService.product.findMany({
            where: { id: { in: items.map((i) => i.productId) } },
        });

        const orderItems = items.map((item) => {
            const product = productRecords.find((p) => p.id === item.productId);
            if (!product) throw new Error(`Produto com id ${item.productId} não encontrado.`);
            return {
                productId: item.productId,
                quantity: item.quantity,
                title: product.name,
                price: product.price,
                orderId: 0,
            };
        });

        const createOrderDto: CreateOrderDto = {
            items: orderItems,
            buyerName: user.name,
            buyerEmail: user.email,
            buyerCpf: user.cpf,
            paymentMethod,
            couponCode,
        };

        const order = await this.ordersService.createOrder(userId, createOrderDto);

        let discountMultiplier = 1;
        if (couponCode) {
            const coupon = await this.prismaService.coupon.findUnique({ where: { code: couponCode } });
            if (!coupon) throw new NotFoundException('Coupon not found');
            if (coupon.expiresAt < new Date()) throw new BadRequestException('Coupon expired');

            discountMultiplier = 1 - coupon.discount / 100;
        }

        const preferenceItems = order.items.map((i) => ({
            id: i.productId.toString(),
            title: i.title,
            description: `Quantidade: ${i.quantity}`,
            quantity: i.quantity,
            unit_price: i.price * discountMultiplier, 
            currency_id: 'BRL',
        }));

        const preferenceData = {
            body: {
                items: preferenceItems,
                payer: { email: user.email },
                back_urls: {
                    success: 'https://seusite.com/sucesso',
                    failure: 'https://seusite.com/erro',
                    pending: 'https://seusite.com/pendente',
                },
                auto_return: 'approved',
                external_reference: order.id.toString(),
            },
        };

        const result = await this.mercadoPagoPreference.create(preferenceData);

        await this.prismaService.order.update({
            where: { id: order.id },
            data: { mpPreferenceId: result.id, status: OrderStatus.PENDING },
        });

        await this.prismaService.payment.create({
            data: {
                orderId: order.id,
                mpPaymentId: result.id,
                status: 'PENDING',
                amount: order.total,
                method: paymentMethod,
                email: user.email,
            },
        });

        return {
            orderId: order.id,
            items: order.items,
            buyerName: user.name,
            buyerEmail: user.email,
            buyerCpf: user.cpf,
            paymentMethod,
            checkoutUrl: result.init_point ?? '',
        };
    }

    async updatePaymentStatus(mpPaymentId: string, status: string) {
        const payment = await this.prismaService.payment.findFirst({
            where: { mpPaymentId },
            include: { order: true },
        });

        if (!payment) return;

        let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
        if (status === 'approved') paymentStatus = PaymentStatus.APPROVED;
        if (status === 'cancelled') paymentStatus = PaymentStatus.CANCELLED;
        if (status === 'refunded') paymentStatus = PaymentStatus.REFUNDED;

        await this.prismaService.payment.update({
            where: { id: payment.id },
            data: { status: paymentStatus },
        });

        let newStatus: OrderStatus = OrderStatus.PENDING;
        if (status === 'approved') newStatus = OrderStatus.PAID;
        if (status === 'cancelled') newStatus = OrderStatus.CANCELLED;
        if (status === 'refunded') newStatus = OrderStatus.REFUNDED;

        await this.ordersService.updateOrderStatus(payment.orderId, newStatus);
    }

    async createPreference(data: {
        orderId: number;
        items: { id: string; title: string; quantity: number; unit_price: number; }[];
        payerEmail: string;
    }) {
        const result = await this.mercadoPagoPreference.create({
            body: {
                items: data.items,
                payer: { email: data.payerEmail },
                back_urls: {
                    success: 'https://seusite.com/sucesso',
                    failure: 'https://seusite.com/erro',
                    pending: 'https://seusite.com/pendente',
                },
                auto_return: 'approved',
                external_reference: data.orderId.toString(),
            },
        });

        await this.prismaService.order.update({
            where: { id: data.orderId },
            data: { mpPreferenceId: result.id },
        });

        return result; 
    }

}
