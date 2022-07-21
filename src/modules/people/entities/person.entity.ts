import { Peoples } from '@prisma/client';

export class Person implements Peoples {
  id: number;
  name: string;
  documentNumber: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
}
