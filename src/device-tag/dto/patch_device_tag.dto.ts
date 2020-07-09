import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * Patch Device Tag DTO Class
 */
export class PatchDeviceTagDto {
  /**
   * _id field
   */
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
}
