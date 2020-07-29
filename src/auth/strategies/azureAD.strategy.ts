// import { Strategy } from 'passport-azure-ad-oauth2';
// import * as jsonwebtoken from 'jsonwebtoken';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { AuthService, Provider } from '../auth.service';
// import { ConfigService } from '../../config/config.service';

// /**
//  * Azure AD Strategy Class
//  */
// @Injectable()
// export class AzureADStrategy extends PassportStrategy(Strategy, 'azure_ad') {
//   /**
//    * Constructor
//    * @param {ConfigService} configService
//    * @param {AuthService} authService
//    */
//   constructor(
//     readonly configService: ConfigService,
//     readonly authService: AuthService,
//   ) {
//     super({
//       clientID: configService.get('AZURE_CLIENT_ID'),
//       clientSecret: configService.get('AZURE_SECRET'),
//       callbackURL: `${configService.get('API_URL')}/auth/azureAD/callback`,
//       tenant: configService.get('AZURE_TENANT'),
//     });
//   }

//   /* FIXME */
//   async validate(accessToken, refresh_token, profile, done) {
//     try {
//       console.log('accessToken, ', accessToken);
//       const tokenInfo = jsonwebtoken.decode(accessToken);
//       // console.log('tokenInfo, ', tokenInfo);

//       const jwt: string = await this.authService.validateAzureOAuthLogin(
//         {
//           thirdPartyId: tokenInfo['puid'],
//           email: tokenInfo['upn'],
//           name: tokenInfo['name'],
//         },
//         Provider.AZURE_AD,
//       );
//       const user = {
//         jwt,
//       };

//       done(null, user);
//     } catch (err) {
//       console.log(err);
//       done(err, false);
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { ConfigService } from '../../config/config.service';

/**
 * Extracts ID token from header and validates it.
 */
@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure_ad',
) {
  /**
   * Constructor
   * @param {ConfigService} configService
   * @param {AuthService} authService
   */
  constructor(readonly configService: ConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${configService.get(
        'AZURE_TENANT_ID',
      )}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get('AZURE_CLIENT_ID'),
    });
  }

  async validate(data, done) {
    console.log('data, ', data);
    console.log('done, ', done);

    done(null, data);
    return true;
  }
}
