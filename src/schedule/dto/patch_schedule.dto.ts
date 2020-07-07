import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  Matches,
  IsBooleanString,
  ValidateNested,
  IsNumberString,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContentType {
  @IsString()
  content: Schema.Types.ObjectId;

  @IsNumberString()
  interval: number;
}

/**
 * Patch Schedule DTO Class
 */
export class PatchScheduleDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  _id: Schema.Types.ObjectId;

  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayName: string;

  /**
   * Schedule Group field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  @Matches(/^20\d{2}\/\d{2}$/)
  @IsNotEmpty()
  scheduleGroup: string;

  /**
   * Assignment Tag field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsArray()
  assignmentTags: Schema.Types.ObjectId[];

  /**
   * Content List field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ContentType)
  contents: ContentType[];

  /**
   * published field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsBooleanString()
  published: boolean;
}
