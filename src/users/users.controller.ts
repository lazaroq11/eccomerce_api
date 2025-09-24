import { Controller, Get, Patch, Delete, Request, UseGuards, Body, ForbiddenException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto, Users } from './dtos/users';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get('me')
    @ApiOperation({ summary: 'Retorna os dados do usuário logado' })
    @ApiResponse({ status: 200, description: 'Usuário retornado com sucesso', type: Users })
    async me(@Request() request) {
        const user = request['user'];
        return this.usersService.findById(user.id);
    }

    @UseGuards(AuthGuard)
    @Patch('me')
    @ApiOperation({ summary: 'Atualiza os dados do usuário logado' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: Users })
    @ApiBody({ type: UpdateUserDto })
    async updateMe(@Request() request, @Body() data: UpdateUserDto) {
        return this.usersService.updateUser(request.user.id, data);
    }

    @UseGuards(AuthGuard)
    @Get('all')
    @ApiOperation({ summary: 'Lista todos os usuários (Admin)' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada', type: [Users] })
    async findAll(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Deleta um usuário pelo ID (Admin)' })
    @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
    @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
    async deleteUser(@Request() request, @Param('id') id: string) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.deleteUser(id);
    }

    @UseGuards(AuthGuard)
    @Delete('all')
    @ApiOperation({ summary: 'Deleta todos os usuários (Admin)' })
    @ApiResponse({ status: 200, description: 'Todos os usuários deletados com sucesso' })
    async deleteAll(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.deleteAll();
    }
}
