import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from './schedule.model';
import { ScheduleController } from './schedule.controller';
import { DeviceTagSchema } from '../device-tag/device-tag.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: 'DeviceTag', schema: DeviceTagSchema }]),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
