import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

/**
 * Query Self Schedule DTO Class
 */
export class QuerySelfScheduleDto {
  /**
   * MAC Address field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
  @IsNotEmpty()
  macAddress: string;
}
