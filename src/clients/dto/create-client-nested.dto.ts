import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateLocalDto } from 'src/locals/dto/create-local.dto';
import { CreatePersonDto } from 'src/people/dto/create-person.dto';

export class CreateClientNestedDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  clientTypeId: number;

  @ApiProperty({ type: () => CreatePersonDto, isArray: true })
  @Type(() => CreatePersonDto)
  @ValidateNested({ each: true })
  peoples: CreatePersonDto[];

  @ApiProperty({ type: () => CreateLocalDto, isArray: true })
  @Type(() => CreateLocalDto)
  @ValidateNested({ each: true })
  locals: CreateLocalDto[];
}
