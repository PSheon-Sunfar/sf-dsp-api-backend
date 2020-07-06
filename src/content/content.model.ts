import { Schema, Document } from 'mongoose';
import * as validator from 'validator';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose Content Schema
 */
export const ContentSchema = new Schema(
  {
    displayName: { type: String, required: true },
    /* Denormalize */
    scheduleGroup: {
      type: String,
      enum: [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ],
      default: '',
    },
    uri: {
      type: String,
      validate: {
        validator(v: string): boolean {
          return v === '' ? true : validator.isURL(v);
        },
        message: 'CONTENT_URI_NOT_A_VALID_URL',
      },
      lowercase: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

ContentSchema.plugin(mongoosePaginate);

/**
 * Mongoose Content Document
 */
export interface IContent extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Schedule Group
   */
  readonly scheduleGroup: string;
  /**
   * Display Name
   */
  readonly displayName: string;
}
