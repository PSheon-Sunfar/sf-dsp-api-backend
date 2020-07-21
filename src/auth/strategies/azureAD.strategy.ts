import { Strategy } from 'passport-azure-ad-oauth2';
import * as jsonwebtoken from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, Provider } from '../auth.service';
import { ConfigService } from '../../config/config.service';

/**
 * Azure AD Strategy Class
 */
@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'azure_ad') {
  /**
   * Constructor
   * @param {ConfigService} configService
   * @param {AuthService} authService
   */
  constructor(
    readonly configService: ConfigService,
    readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('AZURE_CLIENT_ID'),
      clientSecret: configService.get('AZURE_SECRET'),
      callbackURL: `${configService.get('API_URL')}/auth/azureAD/callback`,
      tenant: configService.get('AZURE_TENANT'),
    });
  }

  /* FIXME */
  async validate(accessToken, refresh_token, profile, done) {
    try {
      const tokenInfo = jsonwebtoken.decode(accessToken);
      // console.log('tokenInfo, ', tokenInfo);

      const jwt: string = await this.authService.validateAzureOAuthLogin(
        {
          thirdPartyId: tokenInfo['puid'],
          email: tokenInfo['upn'],
          name: tokenInfo['name'],
        },
        Provider.AZURE_AD,
      );
      const user = {
        jwt,
      };

      done(null, user);
    } catch (err) {
      console.log(err);
      done(err, false);
    }
  }
}
