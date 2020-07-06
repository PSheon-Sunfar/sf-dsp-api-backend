import {
  BadRequestException,
  Controller,
  Patch,
  Body,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  AzureStorageFileInterceptor,
  AzureStorageService,
  UploadedFileMetadata,
} from '@nestjs/azure-storage';
import { PaginateResult } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentBodyDto } from './dto/create_content.dto';
import { PatchContentDto } from './dto/patch_content.dto';
import { QueryDto } from '../utils/dto/query.dto';
import { contentNameConverter } from '../utils';
import { IContent } from './content.model';

/**
 * Content Controller
 */
@ApiBearerAuth()
@ApiTags('Content')
@Controller('api')
export class ContentController {
  /**
   * Constructor
   * @param ContentService
   */
  constructor(
    private readonly contentService: ContentService,
    private readonly azureStorage: AzureStorageService,
  ) {}

  /**
   * Retrieves all content
   * @query given filter to fetch
   * @returns {Promise<IContent>} queried content data
   */
  @Get('contents')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'content',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Profile Request Failed' })
  async getContents(
    @Query() query: QueryDto,
  ): Promise<PaginateResult<QueryDto>> {
    const contents = await this.contentService.getItems(query);
    if (!contents) {
      throw new BadRequestException(
        'The contents with that query could not be found.',
      );
    }
    return contents;
  }

  /**
   * Create content route to create tag for users
   * @param {ContentBodyDto} contentBodyDto the create content dto
   */
  @Post('content')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AzureStorageFileInterceptor('contentFile'))
  @ApiResponse({ status: 201, description: 'Create Completed' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upload(
    @Body() contentBodyDto: ContentBodyDto,
    @UploadedFile() contentFiles: UploadedFileMetadata,
    // ): Promise<IContent> {
  ) {
    // FIXME: no error handling for duplicate displayName
    console.log('contentBodyDto, ', contentBodyDto);
    console.log('contentFiles, ', contentFiles);
    // contentFile = {
    //   ...contentFile,
    //   originalname: `${contentBodyDto.scheduleGroup}/${contentNameConverter(
    //     contentFile.originalname,
    //   )}`,
    // };
    // const storageUrI = await this.azureStorage.upload(contentFile);
    // const content = await this.contentService.create({
    //   uri: storageUrI.split('?sv=')[0],
    //   ...contentBodyDto,
    // });
    // return content;
  }

  /**
   * Edit a content
   * @param {PatchContentDto} payload
   * @returns {Promise<IContent>} mutated content data
   */
  @Patch('content')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'content',
    action: 'update',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Patch Profile Request Received' })
  @ApiResponse({ status: 400, description: 'Patch Profile Request Failed' })
  async patchContent(@Body() payload: PatchContentDto): Promise<IContent> {
    return await this.contentService.edit(payload);
  }
}
