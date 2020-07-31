import {
  BadRequestException,
  Body,
  Query,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult, Schema } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleService, IGenericMessageBody } from './schedule.service';
import { QueryDto } from '../utils/dto/query.dto';
import { QuerySelfScheduleDto } from './dto/query_self_schedule.dto';
import { CreateScheduleDto } from './dto/create_schedule.dto';
import { PatchScheduleDto } from './dto/patch_schedule.dto';
import { ISchedule } from './schedule.model';

/**
 * Schedule Controller
 */
@ApiBearerAuth()
@ApiTags('schedule')
@Controller('api')
export class ScheduleController {
  /**
   * Constructor
   * @param scheduleService
   */
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * Retrieves self schedule data via mac address
   * @param macAddress the uniq mac address
   * @returns {PaginateResult<QueryDto>} queried schedule data
   */
  @Get('schedule/:macAddress')
  @ApiResponse({ status: 200, description: 'Fetch Schedule Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Schedule Request Failed' })
  async getScheduleViaMacAddress(
    @Param() querySelfScheduleDto: QuerySelfScheduleDto,
    // ): Promise<ISchedule> {
  ): Promise<any> {
    const schedule = await this.scheduleService.getSelfItem(
      querySelfScheduleDto,
    );
    if (!schedule) {
      throw new BadRequestException(
        'The schedule with that mac address could not be found.',
      );
    }
    return schedule;
  }

  /**
   * Retrieves all schedule data
   * @query given filter to fetch
   * @returns {PaginateResult<QueryDto>} queried schedule data
   */
  @Get('schedules')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'schedule',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getSchedules(
    @Query() query: QueryDto,
  ): Promise<PaginateResult<QueryDto>> {
    const schedules = await this.scheduleService.getItems(query);
    if (!schedules) {
      throw new BadRequestException(
        'The schedules with that query could not be found.',
      );
    }
    return schedules;
  }

  /**
   * Create schedule route to create tag for users
   * @param {CreateScheduleDto} createScheduleDto the create schedule dto
   */
  @Post('schedule')
  @ApiResponse({ status: 201, description: 'Create Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<ISchedule> {
    return await this.scheduleService.create(createScheduleDto);
  }

  /**
   * Edit a schedule
   * @param {PatchScheduleDto} payload
   * @returns {Promise<ISchedule>} mutated schedule
   */
  @Patch('schedule')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'schedule',
    action: 'update',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Patch Schedule Request Received' })
  @ApiResponse({ status: 400, description: 'Patch Schedule Request Failed' })
  async patchDeviceTag(
    @Body() patchScheduleDto: PatchScheduleDto,
  ): Promise<ISchedule> {
    return await this.scheduleService.edit(patchScheduleDto);
  }

  /**
   * Removes a schedule from the database
   * @param {Schema.Types.ObjectId} _id the _id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the schedule has been deleted
   */
  @Delete('schedule')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'schedule',
    action: 'delete',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Delete schedule Request Received' })
  @ApiResponse({ status: 400, description: 'Delete schedule Request Failed' })
  async delete(
    @Body('_id') _id: Schema.Types.ObjectId,
  ): Promise<IGenericMessageBody> {
    return await this.scheduleService.delete(_id);
  }
}
