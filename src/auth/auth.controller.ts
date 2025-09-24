import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário já existe' })
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Faz login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async signIn(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }
}
