import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleSchema } from './schedule.model';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Schedule', schema: ScheduleSchema }]),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
