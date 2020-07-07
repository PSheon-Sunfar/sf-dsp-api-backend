import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsAlphanumeric,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

enum sortEnum {
  ASC = '1',
  DESC = '-1',
}

/**
 * Query with filter and condition DTO Class
 */
export class QueryDto {
  /**
   * Filter content
   */
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MaxLength(255)
  filter: string;

  /**
   * filter Filed
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^[a-zA-Z ,]+$/)
  fields: string;

  /**
   * Paginate page index
   */
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  page: string;

  /**
   * Content per page
   */
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  limit: string;

  /**
   * Sort depend
   */
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  sort: string;

  /**
   * Sorting order
   */
  @ApiProperty({
    required: true,
  })
  @IsEnum(sortEnum)
  order: sortEnum;
}
