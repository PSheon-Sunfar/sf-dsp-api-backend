import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceAccessService } from './device-access.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSchema } from './device.model';
import { DeviceTagSchema } from '../device-tag/device-tag.model';
import { DeviceAccessSchema } from './device-access.model';
import { DeviceController } from './device.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: 'DeviceTag', schema: DeviceTagSchema }]),
    MongooseModule.forFeature([
      { name: 'DeviceAccess', schema: DeviceAccessSchema },
    ]),
  ],
  providers: [DeviceService, DeviceAccessService],
  exports: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
