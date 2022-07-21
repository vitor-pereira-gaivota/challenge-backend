import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheEnum } from 'src/common/enums/cacheEnum';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateClientNestedDto } from './dto/create-client-nested.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { ReplaceClientDto } from './dto/replace-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createClientDto: CreateClientDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const client = await prisma.clients.create({
        data: {
          ...createClientDto,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

      return client;
    });
  }

  async createNested(
    createClientNestedDto: CreateClientNestedDto,
    userId: number,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      const client = await prisma.clients.create({
        data: {
          ...createClientNestedDto,
          peoples: {
            create: createClientNestedDto.peoples.map((p) => ({
              ...p,
              updatedBy: userId,
            })),
          },
          locals: {
            create: createClientNestedDto.locals.map((l) => ({
              ...l,
              updatedBy: userId,
            })),
          },
          updatedBy: userId,
        },
        include: { peoples: true, locals: true },
      });

      await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

      return client;
    });
  }

  async findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      const clientsCache = await this.redisService.get(CacheEnum.CLIENTS);
      if (clientsCache) return clientsCache;

      const clients = await prisma.clients.findMany();

      await this.redisService.set(CacheEnum.CLIENTS, clients);

      return clients;
    });
  }

  async findSelect() {
    return this.prismaService.$transaction(async (prisma) => {
      const clientsCache = await this.redisService.get(
        CacheEnum.CLIENTS_SELECT,
      );
      if (clientsCache) return clientsCache;

      const clients = await prisma.clients.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      await this.redisService.set(CacheEnum.CLIENTS_SELECT, clients);

      return clients;
    });
  }

  async findOne(id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const client = await prisma.clients.findFirst({
        where: { id },
        include: { locals: true, peoples: true },
      });

      if (!client) throw new NotFoundException('Client not found');

      return client;
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const client = await prisma.clients.findFirst({
        where: { id },
      });

      if (!client) throw new NotFoundException('Client not found');

      const clientUpdated = await prisma.clients.update({
        where: { id },
        data: {
          ...updateClientDto,
          peoples: {
            connect: updateClientDto.peoples,
          },
          locals: {
            connect: updateClientDto.locals,
          },
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

      return clientUpdated;
    });
  }

  async replace(replaceClientDto: ReplaceClientDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const clients = await prisma.clients.updateMany({
        where: { id: { in: replaceClientDto.targedIds } },
        data: {
          [replaceClientDto.attribute]: replaceClientDto.value,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

      return clients;
    });
  }

  async remove(id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const client = await prisma.clients.findFirst({
        where: { id },
      });

      if (!client) throw new NotFoundException('Client not found');

      await prisma.clients.delete({
        where: { id },
      });

      await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);
    });
  }
}
