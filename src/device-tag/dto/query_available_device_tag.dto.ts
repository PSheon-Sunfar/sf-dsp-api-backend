import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

/**
 * Query Available Device Tags DTO Class
 */
export class QueryAvailableTagsDto {
  /**
   * Schedule Group field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^20\d{2}\/\d{2}$/)
  @IsNotEmpty()
  scheduleGroup: string;
}
