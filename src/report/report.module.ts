import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [ReportController],
  providers: [AuthGuard, ReportService, PrismaService]
})
export class ReportModule {}
