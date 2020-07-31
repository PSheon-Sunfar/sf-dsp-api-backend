import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Query Schedule DTO Class
 */
export class QueryScheduleDto {
  /**
   * MAC Address field
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  scheduleId: Schema.Types.ObjectId;
}
