import { Controller, Get, Request, ForbiddenException, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('dashboard')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }
    @UseGuards(AuthGuard)
    @Get('report')
    async getReport(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.reportService.getReport();
    }
    @UseGuards(AuthGuard)
    @Get('total-sales')
    async totalSales(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.reportService.getTotalSales();
    }
    @UseGuards(AuthGuard)
    @Get('total-orders')
    async totalOrders(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.reportService.getTotalOrders();
    }
    @UseGuards(AuthGuard)
    @Get('products-in-stock')
    async productsInStock(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.reportService.getProductsInStock();
    }
    @UseGuards(AuthGuard)
    @Get('revenue-by-month')
    async revenueByMonth(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.reportService.getRevenueByMonth();
    }
    @UseGuards(AuthGuard)
    @Get('popular-products')
    async popularProducts(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.reportService.getPopularProducts();
    }

    @UseGuards(AuthGuard)
    @Get('total-users')
    async totalUsers(@Request() request){
        if(request.user.role !== 'ADMIN'){
            throw new ForbiddenException('Access denied')
        }

        return this.reportService.getTotalUsers()
    }
}
