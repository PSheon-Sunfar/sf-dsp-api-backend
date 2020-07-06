import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * Roles Builder
 */
export const roles: RolesBuilder = new RolesBuilder();

// The USER app role doesn't have readAny(profiles) because the profile returned provides a password.
// To mutate the return body of mongoose queries try editing the ProfileService
roles
  /* USER */
  .grant(AppRoles.USER)
  .readOwn('profile')
  .updateOwn('profile')
  .deleteOwn('profile')
  .readAny('device')
  .updateOwn('device')
  .deleteOwn('device')
  .readAny('deviceAccess')
  .updateOwn('deviceAccess')
  .deleteOwn('deviceAccess')
  .readAny('deviceTag')
  .updateOwn('deviceTag')
  .deleteOwn('deviceTag')
  .readAny('content')
  .updateOwn('content')
  .deleteOwn('content')
  .readAny('schedule')
  .updateOwn('schedule')
  .deleteOwn('schedule')
  /* ADMIN */
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.USER)
  // .readAny('profiles')
  // .updateAny('profiles')
  // .deleteAny('profiles');
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile')
  .updateAny('device')
  .deleteAny('device')
  .updateAny('deviceAccess')
  .deleteAny('deviceAccess')
  .updateAny('deviceTag')
  .deleteAny('deviceTag')
  .updateAny('content')
  .deleteAny('content')
  .updateAny('schedule')
  .deleteAny('schedule');
