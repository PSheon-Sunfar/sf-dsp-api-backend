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
  IsIn,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContentType {
  @IsString()
  @IsUrl()
  contentURL: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  attachmentURL: string;

  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['image', 'video'])
  fileType: 'image' | 'video';

  @IsOptional()
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
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentType)
  contents: ContentType[];

  /**
   * Published field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsBooleanString()
  published: boolean;
}
