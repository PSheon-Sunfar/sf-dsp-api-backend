import {
  BadRequestException,
  Body,
  Query,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { QueryDto } from '../utils/dto/query.dto';
import { PatchProfileDto, PatchProfileRoleDto } from './dto/patch_profile.dto';
import { IProfile } from './profile.model';

/**
 * Profile Controller
 */
@ApiBearerAuth()
@ApiTags('profile')
@Controller('api')
export class ProfileController {
  /**
   * Constructor
   * @param profileService
   */
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Retrieves a particular profile
   * @query email the profile given email to fetch
   * @returns {Promise<IProfile>} queried profile data
   */
  @Get('profile/:email')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'profile',
    action: 'read',
    possession: 'own',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getProfile(@Param('email') email: string): Promise<IProfile> {
    const profile = await this.profileService.getByEmail(email);
    if (!profile) {
      throw new BadRequestException(
        'The profile with that email could not be found.',
      );
    }
    return profile;
  }

  /**
   * Retrieves a particular profile
   * @param email the profile given email to fetch
   * @returns {Promise<IProfile>} queried profile data
   */
  @Get('profiles')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'profile',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getProfiles(
    @Query() query: QueryDto,
  ): Promise<PaginateResult<QueryDto>> {
    const profiles = await this.profileService.getItems(query);
    if (!profiles) {
      throw new BadRequestException(
        'The profiles with that query could not be found.',
      );
    }
    return profiles;
  }

  /**
   * Edit a profile
   * @param {RegisterPayload} payload
   * @returns {Promise<IProfile>} mutated profile data
   */
  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Patch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Patch Profile Request Failed' })
  async patchProfile(@Body() payload: PatchProfileDto): Promise<IProfile> {
    return await this.profileService.edit(payload);
  }

  /**
   * Edit a profile
   * @param {RegisterPayload} payload
   * @returns {Promise<IProfile>} mutated profile data
   */
  @Patch('profile/role')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'profile',
    action: 'update',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Patch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Patch Profile Request Failed' })
  async patchProfileRole(
    @Body() payload: PatchProfileRoleDto,
  ): Promise<IProfile> {
    return await this.profileService.editRole(payload);
  }

  // /**
  //  * Removes a profile from the database
  //  * @param {string} email the email to remove
  //  * @returns {Promise<IGenericMessageBody>} whether or not the profile has been deleted
  //  */
  // @Delete('profile/:email')
  // @UseGuards(AuthGuard('jwt'), ACGuard)
  // @UseRoles({
  //   resource: 'profile',
  //   action: 'delete',
  //   possession: 'any',
  // })
  // @ApiResponse({ status: 200, description: 'Delete Profile Request Received' })
  // @ApiResponse({ status: 400, description: 'Delete Profile Request Failed' })
  // async delete(@Param('email') email: string): Promise<IGenericMessageBody> {
  //   return await this.profileService.delete(email);
  // }
}
