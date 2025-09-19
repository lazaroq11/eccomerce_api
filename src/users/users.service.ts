import { Injectable } from '@nestjs/common';
import { UpdateUserDto, Users } from './dtos/users';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }

    async findById(id: string): Promise<Users | null> {
        const user = await this.prismaService.user.findUnique({
            where: { id: Number(id) },
        });
        if (!user) {
            return null
        };

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

    }

    async updateUser(id: string, data: UpdateUserDto): Promise<Users | null> {
        const updateUser = await this.prismaService.user.update({
            where: { id: Number(id) },
            data,
        });

        return updateUser
    }

    async findAll(): Promise<Users[]> {
        const users = await this.prismaService.user.findMany();
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    async deleteUser(id: string): Promise<void> {
        await this.prismaService.user.delete({
            where: { id: Number(id) },
        });
    }

    async deleteAll(): Promise<void> {
        await this.prismaService.user.deleteMany();
    }




}
