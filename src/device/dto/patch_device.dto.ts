import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

/**
 * Patch Device DTO Class
 */
export class PatchDeviceDto {
  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  _id: Schema.Types.ObjectId;

  /**
   * MAC Address field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  /**
   * Linked Tags field
   */
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsArray()
  linkedTags: Schema.Types.ObjectId[];
}
