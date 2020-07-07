import { Model, Schema, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { IDeviceTag } from './device-tag.model';
import { ISchedule } from '../schedule/schedule.model';
import { QueryDto } from '../utils/dto/query.dto';
import { QueryAvailableTagsDto } from './dto/query_available_device_tag.dto';
import { CreateDeviceTagDto } from './dto/create_device_tag.dto';
import { PatchDeviceTagDto } from './dto/patch_device_tag.dto';
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
 * Device Tag Service
 */
@Injectable()
export class DeviceTagService {
  /**
   * Constructor
   * @param {Model<IDeviceTag>} deviceTagModel
   * @param {Model<ISchedule>} scheduleModel
   */
  constructor(
    @InjectModel('DeviceTag')
    private readonly deviceTagModel: Model<IDeviceTag>,
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<ISchedule>,
  ) {}

  /**
   * Fetches a device tag from database by UUID
   * @param {string} _id
   * @returns {Promise<IDeviceTag>} queried device tag data
   */
  get(_id: Schema.Types.ObjectId): Promise<IDeviceTag> {
    return this.deviceTagModel.findById(_id).exec();
  }

  /**
   * Fetches a device tag from database by UUID
   * @query {QueryDto} queryDto
   * @returns {PaginateResult<QueryDto>} queried device tag data
   */
  async getItems(queryDto: QueryDto): Promise<PaginateResult<QueryDto> | any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(
      { ...queryDto, populate: 'linkedSchedule' },
      this.deviceTagModel,
      condition,
    );
  }

  /**
   * Fetches all available device tags from database
   * @param {QueryAvailableTagsDto} queryAvailableTagsDto
   * @returns {PaginateResult<QueryDto>} queried device tag data
   */
  async getAvailableItems(
    queryAvailableTagsDto: QueryAvailableTagsDto,
  ): Promise<IDeviceTag[]> {
    const allTags = await this.deviceTagModel.find({});
    const usedTags = await this.scheduleModel
      .find({
        scheduleGroup: queryAvailableTagsDto.scheduleGroup,
      })
      .select('assignmentTags')
      .exec();

    const ALL_TAGS = new Set(allTags.map(item => item._id.toString()));
    const USED_TAGS = usedTags.length
      ? new Set(
          usedTags
            .map(item => item.assignmentTags)
            .reduce((a, b) => [...a, ...b])
            .map(item => item.toString()),
        )
      : new Set([]);

    const difference = Array.from(
      new Set([...ALL_TAGS].filter((item: string) => !USED_TAGS.has(item))),
    ).map(tagId => allTags.find(item => item._id.toString() === tagId));

    return difference;
  }

  /**
   * Fetches a device tag from database by displayName
   * @param {string} displayName
   * @returns {Promise<IDeviceTag>} queried device tag data
   */
  getByDisplayName(displayName: string): Promise<IDeviceTag> {
    return this.deviceTagModel.findOne({ displayName }).exec();
  }

  /**
   * Create a device tag with CreateDeviceTagDto fields
   * @param {CreateDeviceTagDto} createDeviceTagDto device tag payload
   * @returns {Promise<IDeviceTag>} created device tag data
   */
  async create(createDeviceTagDto: CreateDeviceTagDto): Promise<IDeviceTag> {
    const deviceTag = await this.getByDisplayName(
      createDeviceTagDto.displayName,
    );
    if (deviceTag) {
      throw new NotAcceptableException(
        'The device tag with the provided displayName currently exists. Please choose another one.',
      );
    }
    // this will auto assign the admin role to each created user
    const createdDeviceTag = new this.deviceTagModel({
      ...createDeviceTagDto,
    });

    return createdDeviceTag.save();
  }

  /**
   * Edit device tag data
   * @param {PatchDeviceTagDto} patchDeviceTagDto
   * @returns {Promise<IDeviceTag>} mutated device tag data
   */
  async edit(patchDeviceTagDto: PatchDeviceTagDto): Promise<IDeviceTag> {
    const { _id } = patchDeviceTagDto;
    const updatedDeviceTag = await this.deviceTagModel.updateOne(
      { _id },
      patchDeviceTagDto,
    );
    if (updatedDeviceTag.nModified !== 1) {
      throw new BadRequestException(
        'The device tag with that _id does not exist in the system. Please try another one.',
      );
    }
    return this.get(_id);
  }

  /**
   * Delete device tag with given _id
   * @param {string} _id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  delete(_id: Schema.Types.ObjectId): Promise<IGenericMessageBody> {
    return this.deviceTagModel.deleteOne({ _id }).then(doc => {
      if (doc.deletedCount === 1) {
        return { message: `Deleted device tag ${_id} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a device tag by the _id of ${_id}.`,
        );
      }
    });
  }
}
