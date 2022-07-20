import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheEnum } from 'src/common/enums/cacheEnum';
import { RedisService } from 'src/redis/redis.service';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';
import { ReplaceClientDto } from './dto/replace-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createClientDto: CreateClientDto, userId: number) {
    const client = await this.clientsRepository.create({
      ...createClientDto,
      updatedBy: userId,
    });

    await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

    return client;
  }

  async findAll() {
    const clientsCache = await this.redisService.get(CacheEnum.CLIENTS);
    if (clientsCache) return clientsCache;

    const clients = await this.clientsRepository.findAll();

    await this.redisService.set(CacheEnum.CLIENTS, clients);

    return clients;
  }

  async findSelect() {
    const clientsCache = await this.redisService.get(CacheEnum.CLIENTS_SELECT);
    if (clientsCache) return clientsCache;

    const clients = await this.clientsRepository.findSelect();

    await this.redisService.set(CacheEnum.CLIENTS_SELECT, clients);

    return clients;
  }

  async findOne(id: number) {
    const client = await this.clientsRepository.findOneBydId(id);

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto, userId: number) {
    const client = await this.clientsRepository.findOneBydId(id);

    if (!client) throw new NotFoundException('Client not found');

    const clientUpdated = await this.clientsRepository.update(id, {
      ...updateClientDto,
      peoples: {
        connect: updateClientDto.peoples,
      },
      locals: {
        connect: updateClientDto.locals,
      },
      updatedBy: userId,
    });

    await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

    return clientUpdated;
  }

  async replace(replaceClientDto: ReplaceClientDto, userId: number) {
    const clients = await this.clientsRepository.replace(
      replaceClientDto,
      userId,
    );

    await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);

    return clients;
  }

  async remove(id: number) {
    const client = await this.clientsRepository.findOneBydId(id);

    if (!client) throw new NotFoundException('Client not found');

    await this.clientsRepository.remove(id);

    await this.redisService.del(CacheEnum.CLIENTS_SELECT, CacheEnum.CLIENTS);
  }
}
