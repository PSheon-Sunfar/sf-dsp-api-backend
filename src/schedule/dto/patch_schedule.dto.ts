import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  Matches,
} from 'class-validator';

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
   * Display Name field
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
  @IsArray()
  contents: Schema.Types.ObjectId[];

  /**
   * published field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsBoolean()
  published: boolean;
}
