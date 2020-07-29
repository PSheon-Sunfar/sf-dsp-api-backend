import { Model, Schema, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDevice } from './device.model';
import { IDeviceAccess } from './device-access.model';
import { IDeviceTag } from '../device-tag/device-tag.model';
import { QueryDto } from '../utils/dto/query.dto';
import { PatchDeviceDto } from './dto/patch_device.dto';
import { calcLinkAndUnlinkTags } from '../utils';
import * as db from '../utils/db';
import { cpuUsage } from 'process';

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
    @InjectModel('DeviceAccess')
    private readonly deviceAccessModel: Model<IDeviceAccess>,
    @InjectModel('DeviceTag')
    private readonly deviceTagModel: Model<IDeviceTag>,
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
   * Fetches a device from database by MAC Address
   * @body {string} macAddress
   * @returns {PaginateResult<QueryDto>} queried devices data
   */
  async getItemAnalysis(
    macAddress: string,
  ): Promise<PaginateResult<QueryDto> | any> {
    const a = await this.deviceAccessModel.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    });
    console.log('a, ', a);
    const result = await this.deviceAccessModel.aggregate([
      {
        $match: {
          macAddress,
        },
        $gte: [
          '$createdAt',
          new Date(new Date().setDate(new Date().getDate() - 1)),
        ],
      },
      {
        $group: {
          _id: '$macAddress',
          averageCPU: { $avg: '$cpuUsage' },
          averageMemory: { $avg: '$memoryUsage' },
        },
      },
    ]);
    console.log('result, ', result);
    return await this.deviceAccessModel.find({ macAddress });
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
    const oldDevice = await this.get(_id);
    const [UNLINK_TAGS, LINK_TAGS] = calcLinkAndUnlinkTags(
      oldDevice.linkedTags,
      patchDeviceDto.linkedTags || [],
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
              linkedDevices: _id,
            },
          },
        )
        .exec();
    }

    const updatedDevice = await this.deviceModel.updateOne(
      { _id },
      {
        linkedTags: [],
        ...patchDeviceDto,
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
              linkedDevices: _id,
            },
          },
        )
        .exec();
    }

    if (updatedDevice.nModified !== 1) {
      throw new BadRequestException(
        'The device with that _id does not exist in the system. Please try another one.',
      );
    }
    return this.get(_id);
  }
}
