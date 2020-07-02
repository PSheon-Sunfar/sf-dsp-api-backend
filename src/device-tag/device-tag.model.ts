import { Schema, Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose DeviceTag Schema
 */
export const DeviceTagSchema = new Schema(
  {
    displayName: { type: String, required: true },

    /* Denormalization, Break in next version */
    assignmentListJan: {
      type: [String],
      default: [],
    },
    assignmentListFeb: {
      type: [String],
      default: [],
    },
    assignmentListMar: {
      type: [String],
      default: [],
    },
    assignmentListApr: {
      type: [String],
      default: [],
    },
    assignmentListMay: {
      type: [String],
      default: [],
    },
    assignmentListJun: {
      type: [String],
      default: [],
    },
    assignmentListJul: {
      type: [String],
      default: [],
    },
    assignmentListAug: {
      type: [String],
      default: [],
    },
    assignmentListSep: {
      type: [String],
      default: [],
    },
    assignmentListOct: {
      type: [String],
      default: [],
    },
    assignmentListNov: {
      type: [String],
      default: [],
    },
    assignmentListDec: {
      type: [String],
      default: [],
    },
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
   * Assignment List
   */
  readonly assignmentList: string[];
}
