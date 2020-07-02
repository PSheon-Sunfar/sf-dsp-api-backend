import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AppRoles } from '../../app/app.roles';

/**
 * Patch Profile DTO Class
 */
export class PatchProfileDto {
  /**
   * Display Name field
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
  @ApiProperty()
  @IsOptional()
  @Matches(/^[a-zA-Z ]+$/)
  @IsNotEmpty()
  displayName: string;
}

/**
 * Patch Profile Role (Admin) DTO Class
 */
export class PatchProfileRoleDto {
  /**
   * Display Name field
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
  @IsEnum(AppRoles, { each: true })
  @IsNotEmpty()
  roles: AppRoles[];
}
