import { Model, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { IDevice } from './device.model';
import { IDeviceAccess } from './device-access.model';
import { CreateDeviceAccessDto } from './dto/create_device_access.dto';
import { QueryDto } from '../utils/dto/query.dto';
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
export class DeviceAccessService {
  /**
   * Constructor
   * @param {Model<IDevice>} deviceModel
   * @param {Model<IDeviceAccess>} deviceAccessModel
   */
  constructor(
    @InjectModel('Device')
    private readonly deviceModel: Model<IDevice>,
    @InjectModel('DeviceAccess')
    private readonly deviceAccessModel: Model<IDeviceAccess>,
  ) {}

  /**
   * get device with mac address
   * @param {string} macAddress
   * @returns {Promise<IDevice>} queried device data
   */
  getDeviceByMACAddress(macAddress: string): Promise<IDevice> {
    return this.deviceModel.findOne({ macAddress }).exec();
  }

  /**
   * update device last connection
   * @param {date} macAddress
   * @param {date} connectionTimestamp
   * @returns {Promise<IDevice>} queried device data
   */
  updateDeviceLastConnection(macAddress: string): Promise<IDevice> {
    return this.deviceModel
      .findOneAndUpdate({ macAddress }, { lastConnectionAt: new Date() })
      .exec();
  }

  /**
   * Fetches a device access from database by UUID
   * @param {string} _id
   * @returns {Promise<IDeviceAccess>} queried device access data
   */
  get(_id: string): Promise<IDeviceAccess> {
    return this.deviceAccessModel.findById(_id).exec();
  }

  /**
   * Fetches a devices from database by UUID
   * @query {QueryDto} queryDto
   * @returns {PaginateResult<QueryDto>} queried devices data
   */
  async getItems(queryDto: QueryDto): Promise<PaginateResult<QueryDto> | any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(queryDto, this.deviceAccessModel, condition);
  }

  /**
   * Create a device access with CreateDeviceAccessDto fields
   * If device not in device list, sign device up
   * @param {CreateDeviceAccessDto} createDeviceAccessDto device access payload
   * @returns {Promise<IDeviceAccess>} created device access data
   */
  async create(
    createDeviceAccessDto: CreateDeviceAccessDto,
  ): Promise<IDeviceAccess> {
    const deviceExists = await this.getDeviceByMACAddress(
      createDeviceAccessDto.macAddress,
    );
    if (!deviceExists) {
      const createdDevice = new this.deviceModel({
        macAddress: createDeviceAccessDto.macAddress,
      });
      await createdDevice.save();
    } else {
      this.updateDeviceLastConnection(createDeviceAccessDto.macAddress);
    }

    const createdDeviceAccess = new this.deviceAccessModel({
      ...createDeviceAccessDto,
    });
    return createdDeviceAccess.save();
  }
}
