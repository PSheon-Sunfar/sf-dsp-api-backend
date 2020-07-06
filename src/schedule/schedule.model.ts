import { Schema, Document } from 'mongoose';
import { ScheduleEnum } from './schedule.type';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose Schedule Schema
 * TODO add content list interval time
 */
export const ScheduleSchema = new Schema(
  {
    displayName: { type: String, required: true },
    scheduleGroup: {
      type: String,
      required: true,
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
    },
    assignmentTags: [{ type: Schema.Types.ObjectId, ref: 'DeviceTag' }],
    contentList: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
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
  readonly scheduleGroup: ScheduleEnum;
  /**
   * Assignment Tags
   */
  readonly assignmentTags: any;
  /**
   * Content List
   */
  readonly contentList: any;
  /**
   * Schedule Publish status
   */
  readonly published: boolean;
}
