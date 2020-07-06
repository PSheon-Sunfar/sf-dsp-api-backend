import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ScheduleEnum } from '../schedule.type';

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
  @IsNotEmpty()
  scheduleGroup: ScheduleEnum;
}
