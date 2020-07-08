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
  @Matches(/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/)
  @IsNotEmpty()
  macAddress: string;
}
