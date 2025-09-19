import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from './constants';

@Module({
  imports: [JwtModule.register({
    secret: jwtConstants.secret,
    global: true,
    signOptions: { expiresIn: '1d' },
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService]
})
export class AuthModule { }