import mongoose, { Document } from "mongoose";

interface IRefreshToken extends Document {
  userId: string;
  token: any;
}

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
});

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export { RefreshToken };
