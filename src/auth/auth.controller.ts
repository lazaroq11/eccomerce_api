import { Body, Controller, Post } from '@nestjs/common';
import type { SignInDto, SignUpDto } from './dtos/auth';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signup')
    async signUp(@Body() body: SignUpDto) {
        return this.authService.signup(body);

    }
    
    @Post('signin')
    async signIn(@Body() body: SignInDto) {
        return this.authService.signin(body);
    }
}
