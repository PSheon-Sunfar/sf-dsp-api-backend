import {
  Controller,
  Body,
  Req,
  Get,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, ITokenReturnBody } from './auth.service';
import { ProfileService } from '../profile/profile.service';
import { ConfigService } from '../config/config.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Authentication Controller
 */
@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  /**
   * Constructor
   * @param {ConfigService} configService config service
   * @param {AuthService} authService authentication service
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly configService: ConfigService,
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

  // /**
  //  * Login Azure AD route to validate and create tokens for users
  //  * @param {string} accessToken the login dto
  //  */
  // @Post('login/azureAD')
  // @ApiResponse({ status: 201, description: 'Login Completed' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getValidTokenWithAzureAccessToken(
  //   @Body('accessToken') accessToken: string,
  // ): Promise<void> {
  //   // verify azure access token
  //   console.log('accessToken, ', accessToken);
  // }

  /* Google Oauth login */
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // googleLogin(): void {
  //   // initiates the Google OAuth2 login flow
  // }
  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleLoginCallback(@Req() req: any, @Res() res: Response): void {
  //   // handles the Google OAuth2 callback
  //   const jwt: string = req.user.jwt;
  //   // console.log('jwt, ', jwt);
  //   if (jwt)
  //     res.redirect(
  //       302,
  //       `${this.configService.get('APP_URL')}/login/success/${jwt}`,
  //     );
  //   else
  //     res.redirect(302, `${this.configService.get('APP_URL')}/login/failure`);
  // }
  // /* Azure Oauth login */
  // @Get('azureAd')
  // @UseGuards(AuthGuard('azure_ad'))
  // azureADLogin(): void {
  //   // initiates the Google OAuth2 login flow
  // }
  // @Get('azureAd/callback')
  // @UseGuards(AuthGuard('azure_ad'))
  // azureADLoginCallback(@Req() req: any, @Res() res: Response): void {
  //   // handles the Azure AD OAuth2 callback
  //   const jwt: string = req.user.jwt;
  //   // console.log('jwt, ', jwt);
  //   if (jwt)
  //     res.redirect(
  //       302,
  //       `${this.configService.get('APP_URL')}/login/success/${jwt}`,
  //     );
  //   else
  //     res.redirect(302, `${this.configService.get('APP_URL')}/login/failure`);
  // }

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
