import { Request, Response, NextFunction } from "express";
import { UserType } from "./../models/UserType";
import UserModel from "./../models/User";
import { BlacklistedIP, WhitelistedIP } from '../models/IP'; // Update the import path


export const accountLock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user, toLockAccount } = req.body;
  
      // Check if the superadmin is being targeted for locking
      const superAdmin = await UserType.findOne({ name: "Super Admin" });
      const superAdminId = superAdmin?._id.toString();
  
      if (user.userType === superAdminId) {
        return res.json({
          status: 403,
          success: false,
          message: "Cannot lock the superadmin account.",
        });
      }
  
      // Assuming toLockAccount is a boolean value indicating lock or unlock action
      const actionMessage = toLockAccount ? "locked" : "unlocked";
  
      // Update the "active" status based on the action
      await UserModel.updateOne({ _id: user._id }, { isLocked: !toLockAccount });
  
      return res.json({
        status: 200,
        success: true,
        message: `User ${actionMessage} successfully.`,
      });
    } catch (error) {
      next(error);
    }
  };
  

export const blacklistIP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ip } = req.body;

    // Check if the IP is already blacklisted
    const existingBlacklistEntry = await BlacklistedIP.findOne({ ip });

    if (existingBlacklistEntry) {
      return res.json({
        status: 400,
        success: false,
        message: `IP ${ip} is already blacklisted.`,
      });
    }

    // If not, create a new entry in the BlacklistedIP model
    await BlacklistedIP.create({ ip });

    return res.json({
      status: 200,
      success: true,
      message: `IP ${ip} blacklisted successfully.`,
    });
  } catch (error) {
    console.error("Error handling IP blacklisting:", error);
    return res.json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};

export const whitelistIP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ip } = req.body;

    // Check if the IP is blacklisted
    const existingBlacklistEntry = await BlacklistedIP.findOne({ ip });

    if (!existingBlacklistEntry) {
      return res.json({
        status: 400,
        success: false,
        message: `IP ${ip} is not blacklisted.`,
      });
    }

    // If blacklisted, remove the entry from the BlacklistedIP model
    await BlacklistedIP.findOneAndDelete({ ip });

    // Add the IP to the WhitelistedIP model
    await WhitelistedIP.create({ ip });

    return res.json({
      status: 200,
      success: true,
      message: `IP ${ip} whitelisted successfully.`,
    });
  } catch (error) {
    console.error("Error handling IP whitelisting:", error);
    return res.json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};