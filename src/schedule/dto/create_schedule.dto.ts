import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsArray,
  IsBooleanString,
  ValidateNested,
  IsNumberString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContentType {
  @IsString()
  @IsUrl()
  contentURL: string;

  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsNumberString()
  interval: number;
}

/**
 * Create Schedule DTO Class
 */
export class CreateScheduleDto {
  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  /**
   * Schedule Group field
   */
  @ApiProperty({
    required: true,
  })
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
  @IsArray()
  @IsNotEmpty()
  linkedTags: Schema.Types.ObjectId[];

  /**
   * Content List field
   */
  @ApiProperty({
    required: true,
  })
  // @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentType)
  contents: ContentType[];

  /**
   * Published field
   */
  @ApiProperty({
    required: true,
  })
  @IsBooleanString()
  @IsNotEmpty()
  published: boolean;
}
