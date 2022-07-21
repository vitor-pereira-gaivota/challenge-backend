import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReplacePersonDto {
  @ApiProperty({ type: () => Number, isArray: true, required: true })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  targedIds: number[];

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  attribute: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  value: string;
}
