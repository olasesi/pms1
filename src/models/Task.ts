import mongoose, { Document } from "mongoose";

interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  assigned_user: string;
  due_date: Date;
  comments: string;
}

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter new take title"],
    },
    description: {
      type: String,
      required: [true, "Please enter task description"],
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },
    assigned_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    due_date: { type: Date, required: true },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        created_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);

export { Task };
