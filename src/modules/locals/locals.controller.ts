import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LocalsService } from './locals.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import { ReplaceLocalDto } from './dto/replace-local.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRequest } from 'src/common/interfaces/userRequest';

@UseGuards(RolesGuard)
@Controller('locals')
@ApiTags('Locals')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 400, description: 'Badrequest error' })
@ApiBearerAuth()
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}

  @Post()
  create(@Body() createLocalDto: CreateLocalDto, @Request() req: UserRequest) {
    return this.localsService.create(createLocalDto, req.raw.user.id);
  }

  @Get()
  findAll() {
    return this.localsService.findAll();
  }

  @Get('/select')
  findSelect() {
    return this.localsService.findSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocalDto: UpdateLocalDto,
    @Request() req: UserRequest,
  ) {
    return this.localsService.update(+id, updateLocalDto, req.raw.user.id);
  }

  @Put('/replace')
  replace(
    @Body() replacePersonDto: ReplaceLocalDto,
    @Request() req: UserRequest,
  ) {
    return this.localsService.replace(replacePersonDto, req.raw.user.id);
  }
}
