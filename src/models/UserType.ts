import mongoose, { Document } from "mongoose";

interface IUserType extends Document {
  name: string;
}

const UserTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const UserType = mongoose.model<IUserType>("UserType", UserTypeSchema);

const seedUserType = async (): Promise<void> => {
  const defaultUserType = [
    { name: "Super Admin" },
    { name: "Admin P&C" },
    { name: "Admin Strategy" },
    { name: "Line Manager" },
    { name: "Staff" },
  ];

  for (const userType of defaultUserType) {
    await UserType.findOneAndUpdate({ name: userType.name }, userType, {
      upsert: true,
      new: true,
    });
  }
};

export { UserType, seedUserType };
