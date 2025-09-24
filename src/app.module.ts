import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { HealthController } from './health/health.controller';
import { CouponModule } from './coupon/coupon.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductController } from './product/product.controller';
import { OrdersController } from './orders/orders.controller';
import { ProductService } from './product/product.service';
import { AuthService } from './auth/auth.service';
import { OrdersService } from './orders/orders.service';
import { CouponService } from './coupon/coupon.service';
import { CartService } from './cart/cart.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProductModule, CategoryModule, CartModule, CouponModule, OrdersModule],
  controllers: [CategoryController, HealthController, ProductController, OrdersController],
  providers: [PrismaService, CategoryService, ProductService, AuthService, OrdersService, CouponService,CartService],
})
export class AppModule {}
