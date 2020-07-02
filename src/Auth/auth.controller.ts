import { Controller, Body, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, ITokenReturnBody } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProfileService } from '../profile/profile.service';

/**
 * Authentication Controller
 */
@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  /**
   * Constructor
   * @param {AuthService} authService authentication service
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginDto} loginDto the login dto
   */
  @Post('login')
  @ApiResponse({ status: 201, description: 'Login Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(loginDto);
    return await this.authService.createToken(user);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {RegisterDto} registerDto the registration dto
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Registration Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() registerDto: RegisterDto): Promise<ITokenReturnBody> {
    const user = await this.profileService.create(registerDto);
    return await this.authService.createToken(user);
  }
}
