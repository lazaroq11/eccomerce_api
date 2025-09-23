import { Controller, Get, Patch, Delete, Request, UseGuards, Body, ForbiddenException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import type { UpdateUserDto } from './dtos/users';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get('me')
    async me(@Request() request) {
        const user = request['user'];
        return this.usersService.findById(user.id);
    }

    @UseGuards(AuthGuard)
    @Patch('me')
    async updateMe(@Request() request, @Body() data: UpdateUserDto) {
        return this.usersService.updateUser(request.user.id, data);
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async findAll(@Request() request) {

        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }

        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(@Request() request, @Param('id') id: string) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }

        return this.usersService.deleteUser(id);
    }


    @UseGuards(AuthGuard)
    @Delete('all')
    async deleteAll(@Request() request) {
        if (request.user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.deleteAll();
    }
}
