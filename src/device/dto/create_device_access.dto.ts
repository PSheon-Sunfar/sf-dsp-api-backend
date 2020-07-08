import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsNumber, Min, Max } from 'class-validator';

/**
 * Create Device Access DTO Class
 */
export class CreateDeviceAccessDto {
  /**
   * MAC Address field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
  @IsNotEmpty()
  macAddress: string;

  /**
   * IP field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b$/)
  @IsNotEmpty()
  ip: string;

  /**
   * CPU usage field
   */
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  cpuUsage: number;

  /**
   * Memory usage field
   */
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  memoryUsage: number;
}
