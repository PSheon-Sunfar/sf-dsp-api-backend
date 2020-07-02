import { Module } from '@nestjs/common';
import { DeviceTagService } from './device-tag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceTagSchema } from './device-tag.model';
import { DeviceTagController } from './device-tag.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'DeviceTag', schema: DeviceTagSchema }]),
  ],
  providers: [DeviceTagService],
  exports: [DeviceTagService],
  controllers: [DeviceTagController],
})
export class DeviceTagModule {}
