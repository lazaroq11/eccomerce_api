// coupon.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCouponDto } from './dtos/coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prismaService: PrismaService) {}

  async createCoupons(data: CreateCouponDto[]): Promise<CreateCouponDto[]> {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Nenhum cupom fornecido');
    }

    const codes = data.map((c) => c.code);
    const existingCoupons = await this.prismaService.coupon.findMany({
      where: { code: { in: codes } },
    });

    if (existingCoupons.length > 0) {
      const existingCodes = existingCoupons.map((c) => c.code).join(', ');
      throw new Error(`Os seguintes códigos já existem: ${existingCodes}`);
    }

    const created = await Promise.all(
      data.map((coupon) =>
        this.prismaService.coupon.create({
          data: {
            code: coupon.code,
            discount: coupon.discount,
            expiresAt: coupon.expirationDate,
          },
        }),
      ),
    );

    return created.map((c) => ({
      code: c.code,
      discount: c.discount,
      expirationDate: c.expiresAt,
    }));
  }

  async getAllCoupons(): Promise<CreateCouponDto[]> {
    const coupons = await this.prismaService.coupon.findMany();

    return coupons.map((c) => ({
      code: c.code,
      discount: c.discount,
      expirationDate: c.expiresAt,
    }));
  }

  async getCouponById(id: number): Promise<CreateCouponDto> {
    const coupon = await this.prismaService.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Cupom com id ${id} não encontrado`);
    }

    return {
      code: coupon.code,
      discount: coupon.discount,
      expirationDate: coupon.expiresAt,
    };
  }
}
