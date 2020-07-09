import { Model, Schema, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common';
import { ISchedule } from './schedule.model';
import { IDeviceTag } from '../device-tag/device-tag.model';
import { QueryDto } from '../utils/dto/query.dto';
import { QuerySelfScheduleDto } from './dto/query_self_schedule.dto';
import { CreateScheduleDto } from './dto/create_schedule.dto';
import { PatchScheduleDto } from './dto/patch_schedule.dto';
import { calcLinkAndUnlinkTags } from '../utils';
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
 * Schedule Service
 */
@Injectable()
export class ScheduleService {
  /**
   * Constructor
   * @param {Model<ISchedule>} scheduleModel
   * @param {Model<IDevice>} deviceModel
   */
  constructor(
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<ISchedule>,
    @InjectModel('DeviceTag')
    private readonly deviceTagModel: Model<IDeviceTag>,
  ) {}

  /**
   * Fetches a schedule from database by UUID
   * @param {string} _id
   * @returns {Promise<ISchedule>} queried schedule data
   */
  get(_id: Schema.Types.ObjectId): Promise<ISchedule> {
    return this.scheduleModel.findById(_id).exec();
  }

  /**
   * Fetch a schedule from database by macAddress
   * @query {QuerySelfScheduleDto} querySelfScheduleDto
   * @returns {Promise<ISchedule>} queried schedule data
   */
  async getSelfItem(
    querySelfScheduleDto: QuerySelfScheduleDto,
    // ): Promise<ISchedule[]> {
  ): Promise<any[] | []> {
    const allDeviceTag = await this.deviceTagModel
      .find()
      .populate({ path: 'linkedDevices linkedSchedules' })
      .exec();

    const found = allDeviceTag.filter(deviceTag => {
      if (!deviceTag.linkedDevices.length) return false;
      return deviceTag.linkedDevices.find(
        (device: any) => device.macAddress === querySelfScheduleDto.macAddress,
      );
    });

    if (!found.length) {
      return found;
    } else {
      return found[0].linkedSchedules;
    }
  }

  /**
   * Fetches a schedule from database by UUID
   * @query {QueryDto} queryDto
   * @returns {PaginateResult<QueryDto>} queried schedule data
   */
  async getItems(queryDto: QueryDto): Promise<PaginateResult<QueryDto> | any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(
      { ...queryDto, populate: 'linkedTags contents.content' },
      this.scheduleModel,
      condition,
    );
  }

  /**
   * Fetches a schedule from database by displayName
   * @param {string} displayName
   * @returns {Promise<ISchedule>} queried schedule data
   */
  getByDisplayName(displayName: string): Promise<ISchedule> {
    return this.scheduleModel.findOne({ displayName }).exec();
  }

  /**
   * Linking a tag to a schedule
   * @param {Schema.Types.ObjectId} tagId
   * @param {Schema.Types.ObjectId} scheduleId
   * @returns {Promise<IDeviceTag>} linked device tag data
   */
  linkTagToSchedule(
    linkTagId: Schema.Types.ObjectId,
    scheduleId: Schema.Types.ObjectId,
  ): Promise<IDeviceTag> {
    return this.deviceTagModel
      .updateOne(
        { _id: linkTagId },
        {
          $push: { linkedSchedules: scheduleId },
        },
        {
          new: true,
        },
      )
      .exec();
  }

  /**
   * Create a schedule with CreateScheduleDto fields
   * @param {CreateScheduleDto} createScheduleDto schedule payload
   * @returns {Promise<ISchedule>} created schedule data
   */
  async create(createScheduleDto: CreateScheduleDto): Promise<ISchedule> {
    const existsSchedule = await this.getByDisplayName(
      createScheduleDto.displayName,
    );
    if (existsSchedule) {
      throw new NotAcceptableException(
        'The schedule with the provided displayName currently exists. Please choose another displayName.',
      );
    }

    // this will auto assign the admin role to each created user
    const createdSchedule = new this.scheduleModel({
      ...createScheduleDto,
    });

    /* Link Tags */
    for await (const tagId of createScheduleDto.linkedTags) {
      this.linkTagToSchedule(tagId, createdSchedule._id);
    }

    return createdSchedule.save();
  }

  /**
   * Edit schedule data
   * @param {PatchScheduleDto} patchScheduleDto
   * @returns {Promise<ISchedule>} mutated schedule data
   */
  async edit(patchScheduleDto: PatchScheduleDto): Promise<ISchedule> {
    const { _id } = patchScheduleDto;
    const oldSchedule = await this.get(_id);
    const [UNLINK_TAGS, LINK_TAGS] = calcLinkAndUnlinkTags(
      oldSchedule.linkedTags,
      patchScheduleDto.linkedTags || [],
    );

    /* unlink old tags */
    for await (const unlinkTagId of UNLINK_TAGS) {
      this.deviceTagModel
        .updateOne(
          {
            _id: unlinkTagId,
          },
          {
            $pull: {
              linkedSchedules: _id,
            },
          },
        )
        .exec();
    }

    const updatedSchedule = await this.scheduleModel.updateOne(
      {
        _id,
      },
      {
        linkedTags: [],
        ...patchScheduleDto,
      },
    );

    /* link new tags */
    for await (const linkTagId of LINK_TAGS) {
      this.deviceTagModel
        .updateOne(
          {
            _id: linkTagId,
          },
          {
            $push: {
              linkedSchedules: _id,
            },
          },
        )
        .exec();
    }

    if (updatedSchedule.nModified !== 1) {
      throw new BadRequestException(
        'The schedule with that _id does not exist in the system. Please try another one.',
      );
    }
    return this.get(_id);
  }

  /**
   * NOTE: It is unsafe to remove, save delete function queued
   * Delete schedule with given _id
   * @param {string} _id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  delete(_id: Schema.Types.ObjectId): Promise<IGenericMessageBody> {
    return this.scheduleModel.deleteOne({ _id }).then(doc => {
      if (doc.deletedCount === 1) {
        return { message: `Deleted schedule ${_id} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a schedule by the _id of ${_id}.`,
        );
      }
    });
  }
}
