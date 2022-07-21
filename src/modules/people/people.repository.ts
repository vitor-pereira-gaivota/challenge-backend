import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReplacePersonDto } from './dto/replace-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.peoples.findMany();
  }

  async findSelect() {
    return this.prismaService.peoples.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async create(people: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prismaService.peoples.create({
      data: people,
    });
  }

  async findOneBydId(id: number) {
    return this.prismaService.peoples.findFirst({ where: { id } });
  }

  async update(id: number, people: Partial<Person>) {
    return this.prismaService.peoples.update({
      where: { id },
      data: people,
    });
  }

  async replace(replacePersonDto: ReplacePersonDto, userId: number) {
    return this.prismaService.peoples.updateMany({
      where: { id: { in: replacePersonDto.targedIds } },
      data: {
        [replacePersonDto.attribute]: replacePersonDto.value,
        updatedBy: userId,
      },
    });
  }
}
