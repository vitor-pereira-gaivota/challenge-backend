import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReplaceLocalDto } from './dto/replace-local.dto';
import { Local } from './entities/local.entity';

@Injectable()
export class LocalsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.locals.findMany();
  }

  async findSelect() {
    return this.prismaService.locals.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(local: Omit<Local, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prismaService.locals.create({
      data: local,
    });
  }

  async findOneBydId(id: number) {
    return this.prismaService.locals.findFirst({ where: { id } });
  }

  async update(id: number, local: Partial<Local>) {
    return this.prismaService.locals.update({
      where: { id },
      data: local,
    });
  }

  async replace(replaceLocalDto: ReplaceLocalDto, userId: number) {
    return this.prismaService.locals.updateMany({
      where: { id: { in: replaceLocalDto.targedIds } },
      data: {
        [replaceLocalDto.attribute]: replaceLocalDto.value,
        updatedBy: userId,
      },
    });
  }
}
