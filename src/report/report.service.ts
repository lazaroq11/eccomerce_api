import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
    constructor(private prismaService: PrismaService) { }

    async getTotalSales() {

        const result = await this.prismaService.orderItem.aggregate({
            _sum: {
                price: true,
                quantity: true,
            },
            where: {
                order: {
                    status: 'PAID'
                }
            }
        })

        return result._sum.price
            ? result._sum.price * (result._sum.quantity ?? 1)
            : 0;
    }

    async getTotalOrders() {
        return await this.prismaService.order.count({
            where: { status: 'PAID' },
        });
    }

    async getNewCustomers() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return await this.prismaService.user.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                }
            }
        })
    }

    async getProductsInStock() {
        const result = await this.prismaService.product.aggregate({
            _sum: { stock: true }
        });
        return result._sum.stock ?? 0;
    }

    async getRevenueByMonth() {
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await this.prismaService.order.findMany({
            where: {
                status: 'PAID',
                createdAt: { gte: sixMonthsAgo },
            },
            include: {
                items: true,
            }
        })

        const monthlyRevenue: Record<string, number> = {};

        for (const order of orders) {
            const month = order.createdAt.toISOString().slice(0, 7);
            const orderTotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + orderTotal;
        }

        return monthlyRevenue;
    }

    async getPopularProducts(limit = 5) {
        const items = await this.prismaService.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: {
                _sum: { quantity: 'desc' },
            },
            take: limit,
        });

        const productIds = items.map((i) => i.productId);
        const products = await this.prismaService.product.findMany({
            where: { id: { in: productIds } },
        });

        return items.map((item) => ({
            product: products.find((p) => p.id === item.productId),
            totalSold: item._sum.quantity,
        }));
    }

    async getTotalUsers(){
        return this.prismaService.user.count()
    }

    async getReport() {
        return {
            totalSales: await this.getTotalSales(),
            totalOrders: await this.getTotalOrders(),
            newCustomers: await this.getNewCustomers(),
            totalUsers: await this.getTotalUsers(),
            productsInStock: await this.getProductsInStock(),
            revenueByMonth: await this.getRevenueByMonth(),
            popularProducts: await this.getPopularProducts(),


        }
    }
}
