import * as config from 'config';
import { Module } from '@nestjs/common';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from './content.model';
import { ContentController } from './content.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    AzureStorageModule.withConfig({
      sasKey: config.get('AZURE_STORAGE_SAS_KEY'),
      accountName: config.get('AZURE_STORAGE_ACCOUNT'),
      containerName: 'dsp-demo-container',
    }),
  ],
  providers: [ContentService],
  exports: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
