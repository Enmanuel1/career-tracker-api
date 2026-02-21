import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { mapUserEntityToResponseDto } from '../mapper/users.mapper';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => mapUserEntityToResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return mapUserEntityToResponseDto(user);
  }

  async create(userData: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prismaService.user.create({ data: userData });
    return mapUserEntityToResponseDto(user);
  }

  async update(id: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: userData,
    });
    return mapUserEntityToResponseDto(user);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
}
