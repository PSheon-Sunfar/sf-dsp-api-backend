import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsArray,
  IsBooleanString,
} from 'class-validator';

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
   * Schedule Group field
   */
  @ApiProperty({
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  assignmentTags: Schema.Types.ObjectId[];

  /**
   * Content List field
   */
  @ApiProperty({
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  contents: Schema.Types.ObjectId[];

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
