import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ReplacePersonDto } from './dto/replace-person.dto';
import { UserRequest } from 'src/common/interfaces/userRequest';

@UseGuards(RolesGuard)
@Controller('people')
@ApiTags('People')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 400, description: 'Badrequest error' })
@ApiBearerAuth()
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(
    @Body() createPersonDto: CreatePersonDto,
    @Request() req: UserRequest,
  ) {
    return this.peopleService.create(createPersonDto, req.raw.user.id);
  }

  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @Get('/select')
  findSelect() {
    return this.peopleService.findSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @Request() req: UserRequest,
  ) {
    return this.peopleService.update(+id, updatePersonDto, req.raw.user.id);
  }

  @Put('/replace')
  replace(
    @Body() replacePersonDto: ReplacePersonDto,
    @Request() req: UserRequest,
  ) {
    return this.peopleService.replace(replacePersonDto, req.raw.user.id);
  }
}
