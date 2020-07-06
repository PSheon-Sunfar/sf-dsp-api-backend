import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsUrl } from 'class-validator';
import { ScheduleEnum } from '../../schedule/schedule.type';

/**
 * Create Content DTO Class
 */
export class ContentBodyDto {
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
  @IsEnum(ScheduleEnum, { each: true })
  @IsNotEmpty()
  scheduleGroup: string;
}
export class CreateContentDto extends ContentBodyDto {
  /**
   * Schedule Group field
   */
  @ApiProperty({
    required: true,
  })
  @IsUrl()
  uri: string;
}
