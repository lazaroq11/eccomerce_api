import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super();
        if (!global.prisma) {
            global.prisma = this;
        }

    }

    async onModuleInit() {
        await this.$connect();
    }
}
