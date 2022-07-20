import { Local } from 'src/locals/entities/local.entity';
import { Person } from 'src/people/entities/person.entity';

export class Client {
  id: number;
  name: string;
  clientTypeId: number;
  peoples: Person[];
  locals: Local[];
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
}
