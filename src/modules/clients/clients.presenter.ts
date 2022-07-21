import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Clients, Locals, Peoples } from '@prisma/client';

export class People {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  documentNumber: string;
}

export class Local {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;
}

export class ClientsPresenter {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  clientTypeId: number;

  @ApiProperty({ type: () => People, isArray: true })
  peoples: People[];

  @ApiProperty({ type: () => Local, isArray: true })
  locals: Local[];

  @ApiProperty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt: Date;

  @ApiProperty()
  @IsNumber()
  updatedBy: number;

  constructor(
    client: Clients & {
      locals: Locals[];
      peoples: Peoples[];
    },
  ) {
    this.id = client.id;
    this.name = client.name;
    this.clientTypeId = client.clientTypeId;
    this.peoples = client.peoples;
    this.locals = client.locals;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
    this.updatedBy = client.updatedBy;
  }
}

export class ClientsPaginatedPresenter {
  @ApiProperty({ type: [ClientsPresenter] })
  data: ClientsPresenter[];

  constructor(
    clients: (Clients & {
      locals: Locals[];
      peoples: Peoples[];
    })[],
  ) {
    this.data = clients.map((client) => new ClientsPresenter(client));
  }
}

export class ClientsSimplePresenter {
  @ApiProperty()
  @IsNumber()
  id: number;

  constructor(client: Clients) {
    this.id = client.id;
  }
}

class ClientSelectData {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;
}

export class ClientsSelectPresenter {
  @ApiProperty({ type: () => ClientSelectData, isArray: true })
  data: ClientSelectData[];

  constructor(client: Clients[]) {
    this.data = client.map((c) => ({ id: c.id, name: c.name }));
  }
}
