import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheEnum } from 'src/common/enums/cacheEnum';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { ReplaceLocalDto } from './dto/replace-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';

@Injectable()
export class LocalsService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createLocalDto: CreateLocalDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const local = await prisma.locals.create({
        data: {
          ...createLocalDto,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.LOCALS);

      return local;
    });
  }

  async findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      const localsCache = await this.redisService.get(CacheEnum.LOCALS);
      if (localsCache) return localsCache;

      const locals = await prisma.locals.findMany();

      await this.redisService.set(CacheEnum.LOCALS, locals);

      return locals;
    });
  }

  async findSelect() {
    return this.prismaService.$transaction(async (prisma) => {
      const localsCache = await this.redisService.get(CacheEnum.LOCALS_SELECT);
      if (localsCache) return localsCache;

      const locals = await prisma.locals.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      await this.redisService.set(CacheEnum.LOCALS_SELECT, locals);

      return locals;
    });
  }

  async findOne(id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const local = await prisma.locals.findUnique({
        where: { id },
      });

      if (!local) throw new NotFoundException('Local not found');

      return local;
    });
  }

  async update(id: number, updateLocalDto: UpdateLocalDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const local = await prisma.locals.findUnique({ where: { id } });

      if (!local) throw new NotFoundException('Local not found');

      const localUpdated = await prisma.locals.update({
        where: { id },
        data: {
          ...updateLocalDto,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.LOCALS);

      return localUpdated;
    });
  }

  async replace(replaceLocalDto: ReplaceLocalDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const locals = await prisma.locals.updateMany({
        where: { id: { in: replaceLocalDto.targedIds } },
        data: {
          [replaceLocalDto.attribute]: replaceLocalDto.value,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.LOCALS);

      return locals;
    });
  }
}
