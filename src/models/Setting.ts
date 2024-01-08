// models/Setting.ts
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

// Function to check if social login is allowed
const isSocialLoginAllowed = async (): Promise<boolean> => {
  try {
    // Check if the "socialLogin" setting exists
    let setting = await Setting.findOne({ name: "socialLogin" });

    // If the setting doesn't exist, seed it with the default value
    if (!setting) {
      setting = await Setting.create({ name: "socialLogin", value: false });
    }

    // Return the value of the "socialLogin" setting
    return !!setting.value;
  } catch (error) {
    console.error("Error checking social login status:", error);
    return false;
  }
};

const isRecaptchaEnabled = async (): Promise<boolean> => {
  try {
    // Check if the "recaptcha" setting exists
    let setting = await Setting.findOne({ name: "recaptcha" });

    // If the setting doesn't exist, seed it with the default value
    if (!setting) {
      setting = await Setting.create({ name: "recaptcha", value: false });
    }

    // Return the value of the "recaptcha" setting
    return !!setting.value;
  } catch (error) {
    console.error("Error checking reCAPTCHA status:", error);
    return false;
  }
};

export { Setting, isSocialLoginAllowed, isRecaptchaEnabled };

// { name: "twoFactorAuthentication", value: false },
// { name: "customSecurityQuestions", value: false },
