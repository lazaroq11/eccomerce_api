
import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [CategoryService],
    controllers: [CategoryController]
})
export class CategoryModule { }