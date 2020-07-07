import { Schema, Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose DeviceTag Schema
 */
export const DeviceTagSchema = new Schema(
  {
    displayName: { type: String, required: true },
    linkedSchedule: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Schedule',
        default: undefined,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

DeviceTagSchema.plugin(mongoosePaginate);

/**
 * Mongoose DeviceTag Document
 */
export interface IDeviceTag extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Display Name
   */
  readonly displayName: string;
  /**
   * Linked Schedule
   */
  readonly linkedSchedule: Schema.Types.ObjectId[];
}
