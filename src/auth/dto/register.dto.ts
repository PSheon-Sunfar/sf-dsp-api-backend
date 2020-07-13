import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

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
