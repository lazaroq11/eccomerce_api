import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role as DtoRole } from 'generated/prisma';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export class Users {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'João', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ enum: Role, description: 'Função do usuário' })
  role: DtoRole;

  @ApiProperty({ description: 'Data de criação do usuário', example: '2025-09-23T22:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2025-09-23T22:00:00Z' })
  updatedAt: Date;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome do usuário', example: 'João' })
  name?: string;

  @ApiPropertyOptional({ description: 'Email do usuário', example: 'joao@email.com' })
  email?: string;
}
