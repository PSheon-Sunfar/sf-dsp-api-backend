import { Schema, Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose Device Schema
 */
export const DeviceSchema = new Schema(
  {
    macAddress: {
      type: String,
      required: true,
      validate: {
        validator: (v: string): boolean => {
          return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/.test(
            v,
          );
        },
        message: 'MAC_ADDRESS_IS_NOT_VALID',
      },
      uppercase: true,
    },
    displayName: { type: String },
    linkedTags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DeviceTag',
      },
    ],
    lastConnectionAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

DeviceSchema.plugin(mongoosePaginate);

/**
 * Mongoose Device Document
 */
export interface IDevice extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Uniq MAC Address Name
   */
  readonly macAddress: string;
  /**
   * Display Name
   */
  readonly displayName: string;
  /**
   * Linked Tags
   */
  readonly linkedTags: Schema.Types.ObjectId[];
  /**
   * Last Connection
   */
  readonly lastConnectionAt: Date;
}
