// login.controller.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./../utility/jsonwebtoken";
import User, { UserDocument } from "./../models/User";

import { sendEmail } from "./../utility/emailservice";
import { generateVerificationCode } from "./../utility/generativeverificationcode";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; // Add other necessary modules
import { isSocialLoginAllowed, isRecaptchaEnabled } from "./../models/Setting";
import axios from "axios";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the user already exists with the provided email
    const existingUser: UserDocument | null = await User.findOne({
      email: req.body.email,
    });

    if (existingUser && existingUser.isConfirmed) {
      // User with the given email already exists and is confirmed
      return res.json({
        success: false,
        status: 400,
        message: "User with this email already exists",
      });
    }

    // User does not exist or exists but is not confirmed, proceed with registration
    // ... (your registration logic here)

    // For example, hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const verificationCode = generateVerificationCode(); // Implement this function

    // Creating a new user document
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      isConfirmed: false,
      userType: "Admin P&C",
      verificationCode: verificationCode,

      // Add other properties from the request body
    });

    // Save the new user to the database
    await newUser.save();

    // Example usage
    const confirmationLink = `${process.env.BASE_URL}/confirm-registration?token=${verificationCode}`;

    const confirmationEmailOptions = {
      to: req.body.email, // Replace with the actual recipient email
      subject: "Confirm Your Registration",
      template: "confirmation-email-template",

      context: {
        confirmationLink: confirmationLink,
        // Add other dynamic content here if needed
      },
    };

    await sendEmail(confirmationEmailOptions);

    // Respond to the client without logging in the user immediately
    return res.json({
      success: true,
      status: 200,
      message: "Registration successful. Check your email for confirmation.",
    });
  } catch (err) {
    next(err);
  }
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;

  try {
    // Find the user in the database by the confirmation token
    const user = await User.findOne({ verificationCode: token });

    if (!user) {
      // Handle the case where the user is not found
      return res.json({
        status: 404,
        message: "User not found or invalid token",
      });
    }

    // Update user's confirmation status
    user.isConfirmed = true;
    // Reset confirmation token
    user.verificationCode = null;
    // Save the changes
    await user.save();

    // Respond with a success message
    return res.json({ status: 200, message: "Email confirmed successfully" });
  } catch (err) {
    // Handle other errors
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Function to verify reCAPTCHA response
    const verifyRecaptcha = async (
      recaptchaResponse: string
    ): Promise<boolean> => {
      try {
        // Your reCAPTCHA verification API endpoint
        const recaptchaVerificationUrl =
          "https://www.google.com/recaptcha/api/siteverify";

        // Your reCAPTCHA secret key
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY; // Use environment variable

        // Make a POST request to the reCAPTCHA verification endpoint
        const response = await axios.post(
          recaptchaVerificationUrl,
          {
            secret: recaptchaSecretKey,
            response: recaptchaResponse,
          },
          {
            timeout: 5000, // Set a timeout for the request (in milliseconds)
          }
        );

        // Check if reCAPTCHA verification was successful
        return response.data.success;
      } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        return false;
      }
    };

    const isRecaptchaActive = await isRecaptchaEnabled();

    if (isRecaptchaActive) {
      const isRecaptchaValid = await verifyRecaptcha(
        req.body.recaptchaResponse
      );

      if (!isRecaptchaValid) {
        return res.json({
          status: 403,
          success: false,
          message: "reCAPTCHA validation failed. Are you a robot?",
        });
      }
    }

    const user: UserDocument | null = await User.findOne({
      email: req.body.email,
    });

    if (!user || !user.active) {
      return res.json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        status: 400,
        success: false,
        message: "Wrong password or email address",
      });
    }

    // Generate an access token using the utility function
    const accessToken = generateAccessToken(user._id);

    // Generate a refresh token using the utility function
    const refreshToken = generateRefreshToken(user._id);

    // Save the refresh token in the database
    // (You should have a RefreshToken model and schema defined for this)

    // Omit sensitive information from the user object
    const { password, userType, ...otherDetails } = user.toObject();

    // Send the access token in the response and set the refresh token as a cookie
    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      })
      .json({ status: 200, accessToken, ...otherDetails });
  } catch (err) {
    next(err);
  }
};

// export const socialLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Check if social login is allowed
//     const isAllowed = await isSocialLoginAllowed();

//     if (!isAllowed) {
//       return res.json({
//         status: 403,
//         success: false,
//         message: "Social login is not allowed.",
//       });
//     }

//     const initiateSocialLogin = async (providerName: string, res: Response) => {
//       const { provider } = req.params;
//       let authProvider;

//       // Determine the appropriate Firebase auth provider based on the provider parameter
//       switch (providerName) {
//         case "facebook":
//           authProvider = new firebase.auth.FacebookAuthProvider();
//           break;
//         case "google":
//           authProvider = new firebase.auth.GoogleAuthProvider();
//           break;
//         // Add cases for other providers as needed

//         default:
//           return res.json({
//             status: 400,
//             success: false,
//             error: "Invalid provider",
//           });
//       }

//       try {
//         const result = await firebase.auth().signInWithPopup(authProvider);

//         // Check if the user is registered and active in the database
//         const user = await User.findOne({ email: result.user?.email });

//         if (user && user.active) {
//           // User is registered and active, proceed with authentication

//           // Handle successful login
//           res.json({ success: true, user: result.user });
//         } else {
//           // User is not registered or not active
//           res.json({
//             success: false,
//             message: "User not registered or not active.",
//           });
//         }
//       } catch (error) {
//         // Handle login failure
//         res.json({ success: false, error: error.message });
//       }
//     };

//     await initiateSocialLogin(req.params.provider, res);
//   } catch (err) {
//     next(err);
//   }
// };

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return res.json({
      status: 200,
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// export const socialLogout = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Sign out the currently authenticated user
//     firebase.auth().signOut();

//     return res.json({
//       status: 200,
//       success: true,
//       message: "Social logout successful",
//     });
//   } catch (error) {
//     next(error);
//   }
// };
