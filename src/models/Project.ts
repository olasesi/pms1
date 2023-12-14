import mongoose, { Document } from "mongoose";

interface IProject extends Document {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  team_members: string;
  tasks: string;
}

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide project name"],
    },
    description: {
      type: String,
      required: [true, "Please provide project description"],
    },
    start_date: {
      type: Date,
      required: [true, "Please provide project start date"],
    },
    end_date: {
      type: Date,
      required: [true, "Please provide project end date"],
    },
    team_members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export { Project };
