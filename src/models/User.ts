import { Document, Schema, model, Types } from "mongoose";

 interface UserModel {
  active: Boolean;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isConfirmed: boolean;
  verificationCode: string | null;
  userType: Types.ObjectId;
  isLocked: boolean;
}

export interface UserDocument extends UserModel, Document {
  _id: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    active: {
      type: Boolean,
      default: true,
    },

    firstname: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastname: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Schema.Types.Mixed,
    },
    userType: {
      type: Types.ObjectId as any, // Use 'as any' to bypass TypeScript check
      ref: "UserType",
    },
    isLocked:{
      type:Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default model<UserDocument>("User", UserSchema);
