import { Model, Schema, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { IDevice } from './device.model';
import { QueryDto } from '../utils/dto/query.dto';
import { PatchDeviceDto } from './dto/patch_device.dto';
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
 * Device Service
 */
@Injectable()
export class DeviceService {
  /**
   * Constructor
   * @param {Model<IDevice>} deviceModel
   */
  constructor(
    @InjectModel('Device')
    private readonly deviceModel: Model<IDevice>,
  ) {}

  /**
   * Fetches a device from database by UUID
   * @param {string} _id
   * @returns {Promise<IDevice>} queried device data
   */
  get(_id: Schema.Types.ObjectId): Promise<IDevice> {
    return this.deviceModel.findById(_id).exec();
  }

  /**
   * Fetches a devices from database by UUID
   * @query {QueryDto} queryDto
   * @returns {PaginateResult<QueryDto>} queried devices data
   */
  async getItems(queryDto: QueryDto): Promise<PaginateResult<QueryDto> | any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(queryDto, this.deviceModel, condition);
  }

  /**
   * Edit device data
   * @param {PatchDeviceDto} patchDeviceDto
   * @returns {Promise<IDevice>} mutated device data
   */
  async edit(patchDeviceDto: PatchDeviceDto): Promise<IDevice> {
    const { _id } = patchDeviceDto;
    const updatedDeviceTag = await this.deviceModel.updateOne(
      { _id },
      patchDeviceDto,
    );
    if (updatedDeviceTag.nModified !== 1) {
      throw new BadRequestException(
        'The device with that _id does not exist in the system. Please try another one.',
      );
    }
    return this.get(_id);
  }
}
