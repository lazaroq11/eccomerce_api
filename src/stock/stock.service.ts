import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockHistoryDto, UpdateStockDto } from './dtos/stock.dto';

@Injectable()
export class StockService {
    constructor(private prismaService: PrismaService) { }

    async decreaseStock(productId: number, quantity: number) {
        const product = await this.prismaService.product.findUnique({ where: { id: productId } })

        if (!product) {
            throw new BadRequestException('Produto not found')
        }

        if (product.stock < quantity) {
            throw new BadRequestException("Insufficient stock for product")
        }

        await this.prismaService.$transaction([
            this.prismaService.product.update({
                where: { id: productId },
                data: { stock: { decrement: quantity } },
            }),

            this.prismaService.stockHistory.create({
                data: {
                    productId,
                    quantity,
                    type: "OUT",
                },
            }),
        ]);
    };

    async increaseStock(productId: number, quantity: number) {
        const product = await this.prismaService.product.findUnique({ where: { id: productId } })

        if (!product) {
            throw new BadRequestException('Product not found')
        }

        await this.prismaService.$transaction([
            this.prismaService.product.update({
                where: { id: productId },
                data: { stock: { increment: quantity } },
            }),
            this.prismaService.stockHistory.create({
                data: {
                    productId,
                    quantity,
                    type: "IN",
                },
            }),
        ]);
    }

    async updateStock(data: UpdateStockDto): Promise<StockHistoryDto> {
        const product = await this.prismaService.product.findUnique({
            where: { id: data.productId },
        })

        if (!product)
            throw new BadRequestException("Product not found");

        let newStock = product.stock;
        if (data.type === "IN") {
            newStock += data.quantity;
        } else if (data.type === "OUT") {
            if (product.stock < data.quantity) {
                throw new BadRequestException("Insufficient stock for product")
            }

            newStock -= data.quantity;
        }
        await this.prismaService.product.update({
            where: { id: data.productId },
            data: { stock: newStock },
        });

        const history = await this.prismaService.stockHistory.create({
            data: {
                productId: data.productId,
                quantity: data.quantity,
                type: data.type,
            },
        });

        return history;
    }

    async getStockHistory(productId?: number): Promise<StockHistoryDto[]> {
        return this.prismaService.stockHistory.findMany({
            where: productId ? { productId } : undefined,
            orderBy: { createdAt: "desc" },
        });
    };
}
