import { Clients } from '@prisma/client';
import { Local } from 'src/modules/locals/entities/local.entity';
import { Person } from 'src/modules/people/entities/person.entity';

export class Client implements Clients {
  id: number;
  name: string;
  clientTypeId: number;
  peoples: Person[];
  locals: Local[];
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
}
