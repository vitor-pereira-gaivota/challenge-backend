import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReplaceClientDto } from './dto/replace-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.clients.findMany();
  }

  async findSelect() {
    return this.prismaService.clients.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(client: any) {
    return this.prismaService.clients.create({
      data: client,
    });
  }

  async findOneBydId(id: number) {
    return this.prismaService.clients.findFirst({
      where: { id },
      include: { locals: true, peoples: true },
    });
  }

  async update(id: number, client: any) {
    return this.prismaService.clients.update({
      where: { id },
      data: client,
    });
  }

  async replace(replaceClientDto: ReplaceClientDto, userId: number) {
    return this.prismaService.clients.updateMany({
      where: { id: { in: replaceClientDto.targedIds } },
      data: {
        [replaceClientDto.attribute]: replaceClientDto.value,
        updatedBy: userId,
      },
    });
  }

  async remove(id: number) {
    await this.prismaService.clients.delete({
      where: { id },
    });
  }
}
