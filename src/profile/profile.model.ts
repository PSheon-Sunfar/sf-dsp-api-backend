import { Schema, Document } from 'mongoose';
import { AppRoles } from '../app/app.roles';
import * as mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Mongoose Profile Schema
 */
export const ProfileSchema = new Schema(
  {
    thirdPartyProvider: {
      type: String,
      enum: ['google', 'azureAD', 'local'],
      default: 'local',
    },
    thirdPartyId: { type: String, default: null },
    email: { type: String, required: true },
    password: {
      type: String,
      select: false,
    },
    displayName: { type: String, required: true },
    roles: [{ type: String, enum: [AppRoles.USER, AppRoles.ADMIN] }],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

ProfileSchema.plugin(mongoosePaginate);

/**
 * Mongoose Profile Document
 */
export interface IProfile extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Third Party Provider
   */
  readonly thirdPartyProvider: string;
  /**
   * Third Party Id
   */
  readonly thirdPartyId: string;
  /**
   * Display Name
   */
  readonly displayName: string;
  /**
   * Email
   */
  readonly email: string;
  /**
   * Password
   */
  password: string;
  /**
   * Roles
   */
  readonly role: AppRoles;
}
