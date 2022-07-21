import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRequest } from 'src/common/interfaces/userRequest';
import {
  ClientsPaginatedPresenter,
  ClientsPresenter,
  ClientsSelectPresenter,
  ClientsSimplePresenter,
} from './clients.presenter';
import { ClientsService } from './clients.service';
import { CreateClientNestedDto } from './dto/create-client-nested.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { ReplaceClientDto } from './dto/replace-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@UseGuards(RolesGuard)
@Controller('clients')
@ApiTags('Clients')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 400, description: 'Badrequest error' })
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: ClientsSimplePresenter,
  })
  async create(
    @Body() createClientDto: CreateClientDto,
    @Request() req: UserRequest,
  ): Promise<ClientsSimplePresenter> {
    const client = await this.clientsService.create(
      createClientDto,
      req.raw.user.id,
    );

    return new ClientsSimplePresenter(client);
  }

  @Post('/nested')
  @ApiResponse({
    status: 201,
    type: ClientsPresenter,
  })
  async createNested(
    @Body() createClientNestedDto: CreateClientNestedDto,
    @Request() req: UserRequest,
  ): Promise<ClientsPresenter> {
    const client = await this.clientsService.createNested(
      createClientNestedDto,
      req.raw.user.id,
    );

    return new ClientsPresenter(client);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: ClientsPaginatedPresenter,
  })
  async findAll(): Promise<ClientsPaginatedPresenter> {
    const clients = await this.clientsService.findAll();

    return new ClientsPaginatedPresenter(clients);
  }

  @Get('/select')
  @ApiResponse({
    status: 200,
    type: ClientsSelectPresenter,
  })
  async findSelect(): Promise<ClientsSelectPresenter> {
    const clients = await this.clientsService.findSelect();

    return new ClientsSelectPresenter(clients);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ClientsPresenter,
  })
  async findOne(@Param('id') id: string): Promise<ClientsPresenter> {
    const client = await this.clientsService.findOne(+id);

    return new ClientsPresenter(client);
  }

  @Put(':id')
  @Roles('super')
  @ApiResponse({
    status: 200,
    type: ClientsPresenter,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: UserRequest,
  ) {
    const client = await this.clientsService.update(
      +id,
      updateClientDto,
      req.raw.user.id,
    );

    return new ClientsPresenter(client);
  }

  @Put('/replace')
  @Roles('super')
  async replace(
    @Body() replaceClientDto: ReplaceClientDto,
    @Request() req: UserRequest,
  ) {
    return this.clientsService.replace(replaceClientDto, req.raw.user.id);
  }

  @Delete(':id')
  @Roles('super')
  async remove(@Param('id') id: string) {
    await this.clientsService.remove(+id);
  }
}
