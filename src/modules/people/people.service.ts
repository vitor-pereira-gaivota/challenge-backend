import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheEnum } from 'src/common/enums/cacheEnum';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { ReplacePersonDto } from './dto/replace-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PeopleService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createPersonDto: CreatePersonDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const people = await prisma.peoples.create({
        data: {
          ...createPersonDto,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.PEOPLES);

      return people;
    });
  }

  async findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      const peoplesCache = await this.redisService.get(CacheEnum.PEOPLES);
      if (peoplesCache) return peoplesCache;

      const peoples = await prisma.peoples.findMany();

      await this.redisService.set(CacheEnum.PEOPLES, peoples);

      return peoples;
    });
  }

  async findSelect() {
    return this.prismaService.$transaction(async (prisma) => {
      const peoplesCache = await this.redisService.get(
        CacheEnum.PEOPLES_SELECT,
      );
      if (peoplesCache) return peoplesCache;

      const peoples = await prisma.peoples.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      await this.redisService.set(CacheEnum.PEOPLES_SELECT, peoples);

      return peoples;
    });
  }

  async findOne(id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const people = await prisma.peoples.findUnique({
        where: { id },
      });

      if (!people) throw new NotFoundException('People not found');

      return people;
    });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const people = await await prisma.peoples.findUnique({
        where: { id },
      });

      if (!people) throw new NotFoundException('People not found');

      const peopleUpdated = await prisma.peoples.update({
        where: { id },
        data: {
          ...updatePersonDto,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.PEOPLES_SELECT, CacheEnum.PEOPLES);

      return peopleUpdated;
    });
  }

  async replace(replacePersonDto: ReplacePersonDto, userId: number) {
    return this.prismaService.$transaction(async (prisma) => {
      const people = await prisma.peoples.updateMany({
        where: { id: { in: replacePersonDto.targedIds } },
        data: {
          [replacePersonDto.attribute]: replacePersonDto.value,
          updatedBy: userId,
        },
      });

      await this.redisService.del(CacheEnum.PEOPLES_SELECT, CacheEnum.PEOPLES);

      return people;
    });
  }
}
