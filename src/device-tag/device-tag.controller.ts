import {
  BadRequestException,
  Controller,
  Patch,
  Body,
  Get,
  Post,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult, Schema } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceTagService, IGenericMessageBody } from './device-tag.service';
import { CreateDeviceTagDto } from './dto/create_device_tag.dto';
import { PatchDeviceTagDto } from './dto/patch_device_tag.dto';
import { QueryAvailableTagsDto } from './dto/query_available_device_tag.dto';
import { QueryDto } from '../utils/dto/query.dto';
import { IDeviceTag } from './device-tag.model';

/**
 * Device Tags Controller
 */
@ApiBearerAuth()
@ApiTags('Device Tag')
@Controller('api')
export class DeviceTagController {
  /**
   * Constructor
   * @param deviceTagService
   */
  constructor(private readonly deviceTagService: DeviceTagService) {}

  /**
   * Retrieves all device tag
   * @query given filter to fetch
   * @returns {PaginateResult<QueryDto>} queried device-tag data
   */
  @Get('device-tags')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'deviceTag',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getDeviceTags(
    @Query() query: QueryDto,
  ): Promise<PaginateResult<QueryDto>> {
    const deviceTags = await this.deviceTagService.getItems(query);
    if (!deviceTags) {
      throw new BadRequestException(
        'The device-tag with that query could not be found.',
      );
    }
    return deviceTags;
  }

  /**
   * Retrieves all available device tags group by schedule group
   * @query given filter to fetch
   * @returns {PaginateResult<QueryDto>} queried device-tag data
   */
  @Post('device-tags/available')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'deviceTag',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({
    status: 200,
    description: 'Fetch Available device tags Request Received',
  })
  @ApiResponse({
    status: 400,
    description: 'Fetch Available device tags Request Failed',
  })
  async getAvailableDeviceTags(
    @Body() queryAvailableTagsDto: QueryAvailableTagsDto,
  ): Promise<IDeviceTag[]> {
    const deviceTags = await this.deviceTagService.getAvailableItems(
      queryAvailableTagsDto,
    );
    if (!deviceTags) {
      throw new BadRequestException(
        'The device-tags with that query could not be found.',
      );
    }
    return deviceTags;
  }

  /**
   * Create Device Tag route to create tag for users
   * @param {CreateDeviceTagDto} createDeviceTagDto the registration dto
   */
  @Post('device-tag')
  @ApiResponse({ status: 201, description: 'Create Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(
    @Body() createDeviceTagDto: CreateDeviceTagDto,
  ): Promise<IDeviceTag> {
    const deviceTag = await this.deviceTagService.create(createDeviceTagDto);
    return deviceTag;
  }

  /**
   * Edit a device tag
   * @param {PatchDeviceTagDto} payload
   * @returns {Promise<IDeviceTag>} mutated device tag
   */
  @Patch('device-tag')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'deviceTag',
    action: 'update',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Patch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Patch Profile Request Failed' })
  async patchDeviceTag(
    @Body() payload: PatchDeviceTagDto,
  ): Promise<IDeviceTag> {
    return await this.deviceTagService.edit(payload);
  }

  /**
   * Removes a device tag from the database
   * @param {Schema.Types.ObjectId} _id the _id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the device tag has been deleted
   */
  @Delete('device-tag')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'deviceTag',
    action: 'delete',
    possession: 'any',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete Device tag Request Received',
  })
  @ApiResponse({ status: 400, description: 'Delete Device tag Request Failed' })
  async delete(
    @Body('_id') _id: Schema.Types.ObjectId,
  ): Promise<IGenericMessageBody> {
    return await this.deviceTagService.delete(_id);
  }
}
