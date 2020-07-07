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
import { CreateScheduleDto } from './dto/create_schedule.dto';
import { PatchScheduleDto } from './dto/patch_schedule.dto';
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
   * Fetches a schedule from database by UUID
   * @query {QueryDto} queryDto
   * @returns {PaginateResult<QueryDto>} queried schedule data
   */
  async getItems(queryDto: QueryDto): Promise<PaginateResult<QueryDto> | any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(
      { ...queryDto, populate: 'assignmentTags contents.content' },
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
    tagId: Schema.Types.ObjectId,
    scheduleId: Schema.Types.ObjectId,
  ): Promise<IDeviceTag> {
    return this.deviceTagModel
      .findOneAndUpdate(
        { _id: tagId },
        {
          $push: { linkedSchedule: scheduleId },
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

    for await (const tagId of createScheduleDto.assignmentTags) {
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
    const updatedSchedule = await this.scheduleModel.updateOne(
      { _id },
      patchScheduleDto,
    );
    if (updatedSchedule.nModified !== 1) {
      throw new BadRequestException(
        'The schedule with that _id does not exist in the system. Please try another one.',
      );
    }
    return this.get(_id);
  }
}
