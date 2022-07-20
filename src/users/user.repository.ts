import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number) {
    return this.prismaService.users.findFirst({ where: { id } });
  }
}
