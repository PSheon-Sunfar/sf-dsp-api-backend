import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsIn,
} from 'class-validator';

/**
 * Register DTO Class
 */
export class RegisterDto {
  /**
   * Email field
   */
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^[a-zA-Z ]+$/)
  @IsNotEmpty()
  displayName: string;

  /**
   * Password field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
export class RegisterThirdPartyDto {
  /**
   * Third Party Provider field
   */
  @ApiProperty({
    required: true,
  })
  @IsIn(['google'])
  @IsNotEmpty()
  thirdPartyProvider: string;

  /**
   * Third Party Id field
   */
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  thirdPartyId: string;

  /**
   * Email field
   */
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Display Name field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^[a-zA-Z ]+$/)
  @IsNotEmpty()
  displayName: string;
}
