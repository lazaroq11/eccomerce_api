import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentMethod } from 'generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }
    @UseGuards(AuthGuard)
    @Post('checkout')
    async createCheckout(
        @Body() body: { userId: number; items: { productId: number; quantity: number }[] }
    ) {
        return this.paymentService.createOrderAndPreference(body.userId, body.items);
    }
    @Post('webhook')
    @ApiOperation({ summary: 'Recebe notificações do Mercado Pago sobre pagamentos' })
    @ApiResponse({ status: 200, description: 'Notificação recebida' })
    async handleWebhook(@Body() body: any) {
        const { preference_id, status } = body;

        if (!preference_id || !status) {
            return { received: false };
        }

        await this.paymentService.updatePaymentStatus(preference_id, status);

        return { received: true };
    }
}
