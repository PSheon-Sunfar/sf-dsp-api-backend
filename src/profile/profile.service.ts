import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { IProfile } from './profile.model';
import { RegisterDto, RegisterThirdPartyDto } from '../auth/dto/register.dto';
import { AppRoles } from '../app/app.roles';
import { QueryDto } from '../utils/dto/query.dto';
import { PatchProfileDto, PatchProfileRoleDto } from './dto/patch_profile.dto';
import * as db from '../utils/db';

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * Profile Service
 */
@Injectable()
export class ProfileService {
  /**
   * Constructor
   * @param {Model<IProfile>} profileModel
   */
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<IProfile>,
  ) {}

  /**
   * Fetches a profile from database by UUID
   * @param {string} _id
   * @returns {Promise<IProfile>} queried profile data
   */
  get(_id: string): Promise<IProfile> {
    return this.profileModel.findById(_id).exec();
  }

  /**
   * Fetches a profile from database by UUID
   * @query {QueryDto} queryDto
   * @returns {Promise<IProfile>} queried profile data
   */
  async getItems(queryDto: QueryDto): Promise<any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(queryDto, this.profileModel, condition);
  }

  /**
   * Fetches a profile from database by email
   * @param {string} email
   * @returns {Promise<IProfile>} queried profile data
   */
  getByEmail(email: string): Promise<IProfile> {
    return this.profileModel.findOne({ email }).exec();
  }

  /**
   * Fetches a local profile from database by email
   * @param {string} email
   * @returns {Promise<IProfile>} queried profile data
   */
  getLocalByEmail(email: string): Promise<IProfile> {
    return this.profileModel
      .findOne({ email, thirdPartyProvider: 'local' })
      .exec();
  }

  /**
   * Fetches a profile from database by third party id
   * @param {string} thirdPartyId
   * @returns {Promise<IProfile>} queried profile data
   */
  findOneByThirdPartyId(
    thirdPartyId: string,
    thirdPartyProvider: string,
  ): Promise<IProfile> {
    return this.profileModel
      .findOne({ thirdPartyProvider, thirdPartyId })
      .exec();
  }

  /**
   * Register User with Third Party Channel
   * @param {RegisterThirdPartyDto} registerDto profile payload
   * @returns {Promise<IProfile>} queried profile data
   */
  createOAuthUser(registerDto: RegisterThirdPartyDto): Promise<IProfile> {
    const createdProfile = new this.profileModel({
      ...registerDto,
      roles: AppRoles.USER,
    });

    return createdProfile.save();
  }

  /**
   * Fetches a profile by their email and hashed password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<IProfile>} queried profile data
   */
  getByEmailAndPass(email: string, password: string): Promise<IProfile> {
    return this.profileModel
      .findOne({
        email,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  /**
   * Create a profile with RegisterDto fields
   * @param {RegisterDto} registerDto profile payload
   * @returns {Promise<IProfile>} created profile data
   */
  async create(registerDto: RegisterDto): Promise<IProfile> {
    const user = await this.getByEmail(registerDto.email);
    if (user) {
      throw new NotAcceptableException(
        'The account with the provided email currently exists. Please choose another one.',
      );
    }
    // this will auto assign the admin role to each created user
    const createdProfile = new this.profileModel({
      ...registerDto,
      password: crypto.createHmac('sha256', registerDto.password).digest('hex'),
      roles: AppRoles.USER,
    });

    return createdProfile.save();
  }

  /**
   * Edit profile data
   * @param {PatchProfileDto} patchProfileDto
   * @returns {Promise<IProfile>} mutated profile data
   */
  async edit(patchProfileDto: PatchProfileDto): Promise<IProfile> {
    const { email } = patchProfileDto;
    const updatedProfile = await this.profileModel.updateOne(
      { email },
      patchProfileDto,
    );
    if (updatedProfile.nModified !== 1) {
      throw new BadRequestException(
        'The profile with that email does not exist in the system. Please try another email.',
      );
    }
    return this.getByEmail(email);
  }

  /**
   * Edit profile data
   * @param {PatchProfileRoleDto} patchProfileRoleDto
   * @returns {Promise<IProfile>} mutated profile data
   */
  async editRole(patchProfileRoleDto: PatchProfileRoleDto): Promise<IProfile> {
    const { email } = patchProfileRoleDto;
    const updatedProfile = await this.profileModel.updateOne(
      { email },
      patchProfileRoleDto,
    );
    if (updatedProfile.nModified !== 1) {
      throw new BadRequestException(
        'The profile with that email does not exist in the system. Please try another email.',
      );
    }
    return this.getByEmail(email);
  }

  /**
   * Delete profile with given a email
   * @param {string} email
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  delete(email: string): Promise<IGenericMessageBody> {
    return this.profileModel.deleteOne({ email }).then(profile => {
      if (profile.deletedCount === 1) {
        return { message: `Deleted ${email} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a profile by the mail address of ${email}.`,
        );
      }
    });
  }
}
