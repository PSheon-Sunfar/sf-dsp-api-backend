import { Model, Schema, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { ISchedule } from './schedule.model';
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
   */
  constructor(
    @InjectModel('Schedule')
    private readonly scheduleModel: Model<ISchedule>,
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
    return await db.getItems(queryDto, this.scheduleModel, condition);
  }
}
