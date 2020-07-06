import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { IContent } from './content.model';
import { QueryDto } from '../utils/dto/query.dto';
import { CreateContentDto } from './dto/create_content.dto';
import { PatchContentDto } from './dto/patch_content.dto';
import * as db from '../utils/db';

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * Content Service
 */
@Injectable()
export class ContentService {
  /**
   * Constructor
   * @param {Model<IContent>} contentModel
   */
  constructor(
    @InjectModel('Content')
    private readonly contentModel: Model<IContent>,
  ) {}

  /**
   * Fetches a content from database by UUID
   * @param {string} _id
   * @returns {Promise<IContent>} queried content data
   *
   */
  get(_id: string): Promise<IContent> {
    return this.contentModel.findById(_id).exec();
  }

  /**
   * Fetches a profile from database by UUID
   * @query {QueryDto} queryDto
   * @returns {Promise<IProfile>} queried profile data
   *
   */
  async getItems(queryDto: QueryDto): Promise<any> {
    const condition = await db.checkQueryString(queryDto);
    return await db.getItems(queryDto, this.contentModel, condition);
  }

  /**
   * Fetches a content from database by displayName
   * @param {string} displayName
   * @returns {Promise<IContent>} queried content data
   */
  getByDisplayName(displayName: string): Promise<IContent> {
    return this.contentModel.findOne({ displayName }).exec();
  }

  /**
   * Create a content with CreateContentDto fields
   * @param {CreateContentDto} createContentDto content payload
   * @returns {Promise<IContent>} created content data
   */
  async create(createContentDto: CreateContentDto): Promise<IContent> {
    const existsContent = await this.getByDisplayName(
      createContentDto.displayName,
    );
    if (existsContent) {
      throw new NotAcceptableException(
        'The content with the provided displayName currently exists. Please choose another displayName.',
      );
    }
    // this will auto assign the admin role to each created user
    const createdContent = new this.contentModel({
      ...createContentDto,
    });

    return createdContent.save();
  }

  /**
   * Edit content data
   * @param {PatchContentDto} patchContentDto
   * @returns {Promise<IContent>} mutated content data
   */
  async edit(patchContentDto: PatchContentDto): Promise<IContent> {
    const { _id } = patchContentDto;
    const updatedContent = await this.contentModel.updateOne(
      { _id },
      patchContentDto,
    );
    if (updatedContent.nModified !== 1) {
      throw new BadRequestException(
        'The content with that _id does not exist in the system. Please try another one.',
      );
    }
    return this.get(_id);
  }

  /**
   * Delete content with given _id
   * @param {string} _id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  delete(_id: Schema.Types.ObjectId): Promise<IGenericMessageBody> {
    return this.contentModel.deleteOne({ _id }).then(doc => {
      if (doc.deletedCount === 1) {
        return { message: `Deleted content ${_id} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a content by the _id of ${_id}.`,
        );
      }
    });
  }
}
