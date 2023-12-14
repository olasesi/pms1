import mongoose, { Document } from "mongoose";

interface ISetting extends Document {
  name: string;
  value: string | number | boolean | null;
}

const SettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model<ISetting>("Setting", SettingSchema);

const seedSettings = async (): Promise<void> => {
  const defaultSettings = [
    { name: "socialLogin", value: false },
    { name: "recaptcha", value: false },
    { name: "twoFactorAuthentication", value: false },
    { name: "accountLocking", value: false },
    { name: "customSecurityQuestions", value: false },
    { name: "ipBlacklisting", value: true },
  ];

  for (const setting of defaultSettings) {
    await Setting.findOneAndUpdate({ name: setting.name }, setting, {
      upsert: true,
      new: true,
    });
  }
};

export { Setting, seedSettings };
