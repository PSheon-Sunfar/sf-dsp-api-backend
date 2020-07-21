import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { Priofile } from 'passport-google-oauth20';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { ProfileService } from '../profile/profile.service';
import { IProfile } from '../profile/profile.model';
import { LoginDto } from './dto/login.dto';

/* All 3-rd party providers */
export enum Provider {
  GOOGLE = 'google',
  AZURE_AD = 'azureAD',
}

/**
 * Models a typical Login/Register route return body
 */
export interface ITokenReturnBody {
  /**
   * When the token is to expire in seconds
   */
  expires: string;
  /**
   * A human-readable format of expires
   */
  expiresPrettyPrint: string;
  /**
   * The Bearer token
   */
  token: string;
}

/**
 * Authentication Service
 */
@Injectable()
export class AuthService {
  /**
   * Time in seconds when the token is to expire
   * @type {string}
   */
  private readonly expiration: string;

  /**
   * Constructor
   * @param {JwtService} jwtService jwt service
   * @param {ConfigService} configService
   * @param {ProfileService} profileService profile service
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly profileService: ProfileService,
  ) {
    this.expiration = this.configService.get('WEBTOKEN_EXPIRATION_TIME');
  }

  /* ANCHOR */
  async validateGoogleOAuthLogin(
    thirdPartyProfile: Priofile,
    provider: Provider,
  ): Promise<string> {
    try {
      const registerDto = {
        thirdPartyProvider: provider,
        thirdPartyId: thirdPartyProfile.id,
        email: thirdPartyProfile._json.email,
        displayName: thirdPartyProfile._json.name,
      };

      const localExist = await this.profileService.getLocalByEmail(
        registerDto.email,
      );
      if (localExist) {
        return null;
      }

      let user: IProfile = await this.profileService.findOneByThirdPartyId(
        registerDto.thirdPartyId,
        provider,
      );
      if (!user) user = await this.profileService.createOAuthUser(registerDto);

      const jwt: string = sign(
        {
          _id: user._id,
          ...registerDto,
        },
        this.configService.get('WEBTOKEN_SECRET_KEY'),
        {
          expiresIn: this.configService.get('WEBTOKEN_EXPIRATION_TIME'),
        },
      );
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException(
        'validateGoogleOAuthLogin',
        err.message,
      );
    }
  }
  async validateAzureOAuthLogin(
    thirdPartyProfile: Priofile,
    provider: Provider,
  ): Promise<string> {
    try {
      const registerDto = {
        thirdPartyProvider: provider,
        thirdPartyId: thirdPartyProfile.id,
        email: thirdPartyProfile.email,
        displayName: thirdPartyProfile.name,
      };

      const localExist = await this.profileService.getLocalByEmail(
        registerDto.email,
      );
      if (localExist) {
        return null;
      }

      let user: IProfile = await this.profileService.findOneByThirdPartyId(
        registerDto.thirdPartyId,
        provider,
      );
      if (!user) user = await this.profileService.createOAuthUser(registerDto);

      const jwt: string = sign(
        {
          _id: user._id,
          ...registerDto,
        },
        this.configService.get('WEBTOKEN_SECRET_KEY'),
        {
          expiresIn: this.configService.get('WEBTOKEN_EXPIRATION_TIME'),
        },
      );
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException(
        'validateAzureOAuthLogin',
        err.message,
      );
    }
  }
  /* ANCHOR */

  /**
   * Creates a signed jwt token based on IProfile dto
   * @param {Profile} param dto to generate token from
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async createToken({
    _id,
    displayName,
    email,
  }: IProfile): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      expiresPrettyPrint: AuthService.prettyPrintSeconds(this.expiration),
      token: this.jwtService.sign({ _id, displayName, email }),
    };
  }

  /**
   * Formats the time in seconds into human-readable format
   * @param {string} time
   * @returns {string} hrf time
   */
  private static prettyPrintSeconds(time: string): string {
    const ntime = Number(time);
    const hours = Math.floor(ntime / 3600);
    const minutes = Math.floor((ntime % 3600) / 60);
    const seconds = Math.floor((ntime % 3600) % 60);

    return `${hours > 0 ? hours + (hours === 1 ? ' hour,' : ' hours,') : ''} ${
      minutes > 0 ? minutes + (minutes === 1 ? ' minute' : ' minutes') : ''
    } ${seconds > 0 ? seconds + (seconds === 1 ? ' second' : ' seconds') : ''}`;
  }

  /**
   * Validates whether or not the profile exists in the database
   * @param {LoginDto} loginDto login payload to authenticate with
   * @returns {Promise<IProfile>} registered profile
   */
  async validateUser(loginDto: LoginDto): Promise<IProfile> {
    const user = await this.profileService.getByEmailAndPass(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException(
        'Could not authenticate. Please try again.',
      );
    }
    return user;
  }
}
