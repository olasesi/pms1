import mongoose, { Document } from "mongoose";

interface IComment extends Document {
  user: string;
  taxt: string;
}

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export { Comment };
