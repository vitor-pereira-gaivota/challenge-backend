import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheEnum } from 'src/common/enums/cacheEnum';
import { RedisService } from 'src/redis/redis.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { ReplacePersonDto } from './dto/replace-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleRepository } from './people.repository';

@Injectable()
export class PeopleService {
  constructor(
    private readonly peopleRepository: PeopleRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createPersonDto: CreatePersonDto, userId: number) {
    const people = await this.peopleRepository.create({
      ...createPersonDto,
      updatedBy: userId,
    });

    await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.PEOPLES);

    return people;
  }

  async findAll() {
    const peoplesCache = await this.redisService.get(CacheEnum.PEOPLES);
    if (peoplesCache) return peoplesCache;

    const peoples = await this.peopleRepository.findAll();

    await this.redisService.set(CacheEnum.PEOPLES, peoples);

    return peoples;
  }

  async findSelect() {
    const peoplesCache = await this.redisService.get(CacheEnum.PEOPLES_SELECT);
    if (peoplesCache) return peoplesCache;

    const peoples = await this.peopleRepository.findSelect();

    await this.redisService.set(CacheEnum.PEOPLES_SELECT, peoples);

    return peoples;
  }

  async findOne(id: number) {
    const people = await this.peopleRepository.findOneBydId(id);

    if (!people) throw new NotFoundException('People not found');

    return people;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, userId: number) {
    const people = await this.peopleRepository.findOneBydId(id);

    if (!people) throw new NotFoundException('People not found');

    const peopleUpdated = await this.peopleRepository.update(id, {
      ...updatePersonDto,
      updatedBy: userId,
    });

    await this.redisService.del(CacheEnum.PEOPLES_SELECT, CacheEnum.PEOPLES);

    return peopleUpdated;
  }

  async replace(replacePersonDto: ReplacePersonDto, userId: number) {
    const people = await this.peopleRepository.replace(
      replacePersonDto,
      userId,
    );

    await this.redisService.del(CacheEnum.PEOPLES_SELECT, CacheEnum.PEOPLES);

    return people;
  }
}
