import { Schema, Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as validator from 'validator';

/**
 * Mongoose Schedule Schema
 */
export const ScheduleSchema = new Schema(
  {
    displayName: { type: String, required: true },
    scheduleGroup: {
      type: String,
      validate: {
        validator: (v: string): boolean => {
          return /^20\d{2}\/\d{2}$/.test(v);
        },
        message: 'SCHEDULE_GROUP_IS_NOT_VALID',
      },
      default: '',
    },
    assignmentTags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DeviceTag',
        default: undefined,
      },
    ],
    contents: [
      {
        contentURL: {
          type: String,
          validate: {
            validator: (v: string): boolean => {
              return validator.isURL(v);
            },
            message: 'NOT_A_VALID_URL',
          },
          required: true,
        },
        interval: { type: Number, required: true, default: 5 },
      },
    ],
    published: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

ScheduleSchema.plugin(mongoosePaginate);

/**
 * Mongoose Schedule Document
 */
export interface ISchedule extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Display Name
   */
  readonly displayName: string;
  /**
   * Schedule Group
   */
  readonly scheduleGroup: string;
  /**
   * Assignment Tags
   */
  readonly assignmentTags: any;
  /**
   * Content List
   */
  readonly contents: any;
  /**
   * Schedule Publish status
   */
  readonly published: boolean;
}
