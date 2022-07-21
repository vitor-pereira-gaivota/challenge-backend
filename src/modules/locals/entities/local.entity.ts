import { Locals } from '@prisma/client';

export class Local implements Locals {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: number;
}
