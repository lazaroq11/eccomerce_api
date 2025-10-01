import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ description: 'Email do usuário', example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  password: string;
}

export class SignUpDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  password: string;

  @ApiProperty({ description: 'CPF do usuário', example: '123.456.789-00' })
  cpf: string;
}
