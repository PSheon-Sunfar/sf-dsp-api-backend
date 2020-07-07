import {
  BadRequestException,
  Body,
  Query,
  Controller,
  Get,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { QueryDto } from '../utils/dto/query.dto';
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
  async register(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<ISchedule> {
    const schedule = await this.scheduleService.create(createScheduleDto);
    return schedule;
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
}
