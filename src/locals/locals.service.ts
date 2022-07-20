import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheEnum } from 'src/common/enums/cacheEnum';
import { RedisService } from 'src/redis/redis.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { ReplaceLocalDto } from './dto/replace-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { LocalsRepository } from './locals.repository';

@Injectable()
export class LocalsService {
  constructor(
    private readonly localsRepository: LocalsRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createLocalDto: CreateLocalDto, userId: number) {
    const local = await this.localsRepository.create({
      ...createLocalDto,
      updatedBy: userId,
    });

    await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.LOCALS);

    return local;
  }

  async findAll() {
    const localsCache = await this.redisService.get(CacheEnum.LOCALS);
    if (localsCache) return localsCache;

    const locals = await this.localsRepository.findAll();

    await this.redisService.set(CacheEnum.LOCALS, locals);

    return locals;
  }

  async findSelect() {
    const localsCache = await this.redisService.get(CacheEnum.LOCALS_SELECT);
    if (localsCache) return localsCache;

    const locals = await this.localsRepository.findSelect();

    await this.redisService.set(CacheEnum.LOCALS_SELECT, locals);

    return locals;
  }

  async findOne(id: number) {
    const local = await this.localsRepository.findOneBydId(id);

    if (!local) throw new NotFoundException('Local not found');

    return local;
  }

  async update(id: number, updateLocalDto: UpdateLocalDto, userId: number) {
    const local = await this.localsRepository.findOneBydId(id);

    if (!local) throw new NotFoundException('Local not found');

    const localUpdated = await this.localsRepository.update(id, {
      ...updateLocalDto,
      updatedBy: userId,
    });

    await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.LOCALS);

    return localUpdated;
  }

  async replace(replaceLocalDto: ReplaceLocalDto, userId: number) {
    const locals = await this.localsRepository.replace(replaceLocalDto, userId);

    await this.redisService.del(CacheEnum.LOCALS_SELECT, CacheEnum.LOCALS);

    return locals;
  }
}
