import { Module } from '@nestjs/common';
import { LocalsService } from './locals.service';
import { LocalsController } from './locals.controller';
import { LocalsRepository } from './locals.repository';

@Module({
  controllers: [LocalsController],
  providers: [LocalsService, LocalsRepository],
})
export class LocalsModule {}
