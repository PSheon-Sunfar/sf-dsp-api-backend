import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ScheduleEnum } from '../schedule.type';

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
  @IsNotEmpty()
  scheduleGroup: ScheduleEnum;

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
  contentList: Schema.Types.ObjectId[];

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
