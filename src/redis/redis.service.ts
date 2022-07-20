import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  public redis: RedisClientType;

  constructor() {
    this.redis = createClient({
      url: 'redis://localhost:6379',
    });

    this.redis.connect();

    this.redis.on('error', (err) => console.log('Redis Client Error', err));
  }

  async get(key: string) {
    const value = await this.redis.get(key);
    return JSON.parse(value);
  }

  async set(key: string, value: unknown) {
    await this.redis.set(key, JSON.stringify(value));
  }

  async del(...key: string[]) {
    await this.redis.del(key);
  }
}
