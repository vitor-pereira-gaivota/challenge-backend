import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

class PeopleData {
  @ApiProperty({ required: false })
  @IsNumber()
  id: number;
}

class localData {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty({ type: () => PeopleData, isArray: true })
  @Type(() => PeopleData)
  @ValidateNested({ each: true })
  peoples: PeopleData[];

  @ApiProperty({ type: () => localData, isArray: true })
  @Type(() => localData)
  @ValidateNested({ each: true })
  locals: localData[];
}
