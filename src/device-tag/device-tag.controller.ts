import {
  BadRequestException,
  Controller,
  Patch,
  Body,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceTagService } from './device-tag.service';
import { CreateDeviceTagDto } from './dto/create_device_tag.dto';
import { PatchDeviceTagDto } from './dto/patch_device_tag.dto';
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
   * @returns {Promise<IDeviceTag>} queried device-tag data
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
    const deviceTag = await this.deviceTagService.getItems(query);
    if (!deviceTag) {
      throw new BadRequestException(
        'The device-tag with that query could not be found.',
      );
    }
    return deviceTag;
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
   * Edit a profile
   * @param {RegisterPayload} payload
   * @returns {Promise<IProfile>} mutated profile data
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
}
