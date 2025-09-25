// coupon.controller.ts
import { Controller, Get, Param, Body, Post, ParseIntPipe, ForbiddenException, Request, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCouponDto } from './dtos/coupon.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }
    @UseGuards(AuthGuard)
    @Post()
    @ApiOperation({ summary: 'Cria novos cupons' })
    @ApiResponse({ status: 201, description: 'Cupons criados', type: [CreateCouponDto] })
    async createCoupon(
        @Request() request: { user: { role: string } },
        @Body() data: CreateCouponDto[]
    ): Promise<CreateCouponDto[]> {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Acesso negado');
        }
        return this.couponService.createCoupons(data);
    }
    
    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Retorna todos os cupons' })
    @ApiResponse({ status: 200, description: 'Lista de cupons', type: [CreateCouponDto] })
    async getAllCoupons(@Request() request): Promise<CreateCouponDto[]> {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.couponService.getAllCoupons();
    }
    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Retorna um cupom pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do cupom' })
    @ApiResponse({ status: 200, description: 'Cupom encontrado', type: CreateCouponDto })
    @ApiResponse({ status: 404, description: 'Cupom não encontrado' })
    async getCouponById(
        @Request() request: { user: { role: string } },
        @Param('id', ParseIntPipe) id: number
    ): Promise<CreateCouponDto> {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.couponService.getCouponById(id);
    }

}
