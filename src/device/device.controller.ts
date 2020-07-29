import {
  BadRequestException,
  Controller,
  Patch,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryDto } from '../utils/dto/query.dto';
import { CreateDeviceAccessDto } from './dto/create_device_access.dto';
import { PatchDeviceDto } from './dto/patch_device.dto';
import { IDevice } from './device.model';
import { DeviceService } from './device.service';
import { DeviceAccessService } from './device-access.service';
import { IDeviceAccess } from './device-access.model';

/**
 * Device Controller
 */
@ApiBearerAuth()
@ApiTags('Device')
@Controller('api')
export class DeviceController {
  /**
   * Constructor
   * @param deviceService
   * @param deviceAccessService
   */
  constructor(
    private readonly deviceService: DeviceService,
    private readonly deviceAccessService: DeviceAccessService,
  ) {}

  /**
   * Retrieves single device status
   * @query given device address to fetch
   * @returns {} queried device data
   */
  @Get('device')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'device',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Device Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Device Request Failed' })
  async getDeviceStatus(
    @Body('macAddress') macAddress: string,
  ): Promise<PaginateResult<QueryDto>> {
    const device = await this.deviceService.getItemAnalysis(macAddress);
    if (!device) {
      throw new BadRequestException(
        'The device with that query could not be found.',
      );
    }
    return device;
  }

  /**
   * Retrieves all device
   * @query given filter to fetch
   * @returns {PaginateResult<QueryDto>} queried device data
   */
  @Get('devices')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'device',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getDevices(
    @Query() query: QueryDto,
  ): Promise<PaginateResult<QueryDto>> {
    const devices = await this.deviceService.getItems(query);
    if (!devices) {
      throw new BadRequestException(
        'The devices with that query could not be found.',
      );
    }
    return devices;
  }

  /**
   * Retrieves all device's access history
   * @query given filter to fetch
   * @returns {PaginateResult<QueryDto>} queried device access data
   */
  @Get('device-accesses')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'deviceAccess',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getDeviceAccesses(
    @Query() query: QueryDto,
  ): Promise<PaginateResult<QueryDto>> {
    const deviceAccesses = await this.deviceAccessService.getItems(query);
    if (!deviceAccesses) {
      throw new BadRequestException(
        'The device accesses with that query could not be found.',
      );
    }
    return deviceAccesses;
  }

  /**
   * Create device access route for device runner
   * @param {CreateDeviceAccessDto} createDeviceAccessDto the device access dto
   */
  @Post('device/connection')
  @ApiResponse({ status: 201, description: 'Create Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async healthCheck(
    @Body() createDeviceAccessDto: CreateDeviceAccessDto,
  ): Promise<IDeviceAccess> {
    const deviceAccess = await this.deviceAccessService.create(
      createDeviceAccessDto,
    );
    return deviceAccess;
  }

  /**
   * Edit a device tag
   * @param {PatchDeviceTagDto} payload
   * @returns {Promise<IDeviceTag>} mutated device tag
   */
  @Patch('device')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'device',
    action: 'update',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Patch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Patch Profile Request Failed' })
  async patchDeviceTag(@Body() payload: PatchDeviceDto): Promise<IDevice> {
    return await this.deviceService.edit(payload);
  }
}
