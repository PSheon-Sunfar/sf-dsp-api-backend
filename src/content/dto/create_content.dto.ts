import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsUrl } from 'class-validator';

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
  @Matches(/^20\d{2}\/\d{2}$/)
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
