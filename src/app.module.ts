import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ProductModule } from './product/product.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, UsersModule, ProductModule, CategoryModule, CartModule],
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService],
})
export class AppModule {}
