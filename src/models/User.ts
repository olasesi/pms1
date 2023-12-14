import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
    userType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserType',
      },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
