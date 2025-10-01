import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartService } from 'src/cart/cart.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PaymentModule)],
  controllers: [OrdersController],
  providers: [OrdersService, CartService],
  exports: [OrdersService],
})
export class OrdersModule {}
