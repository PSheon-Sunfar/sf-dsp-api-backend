import { Schema, Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose DeviceAccess Schema
 */
export const DeviceAccessSchema = new Schema(
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
    ip: {
      type: String,
      required: true,
      validate: {
        validator: (v: string): boolean => {
          return /^\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b$/.test(
            v,
          );
        },
        message: 'IP_IS_NOT_VALID',
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

DeviceAccessSchema.plugin(mongoosePaginate);

/**
 * Mongoose DeviceAccess Document
 */
export interface IDeviceAccess extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Display Name
   */
  readonly displayName: string;
}
