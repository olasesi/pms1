import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./routes/auth";
import { firebaseSetup } from "./utility/firebase";
import { isSocialLoginAllowed } from "./models/Setting";


const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost", // Replace with your frontend domain
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};
app.use(cors(corsOptions));

app.listen(PORT, async () => {
  connect();

    // Check if social login is allowed
    const isSocialLoginActive = await isSocialLoginAllowed();

    // Initialize Firebase if social login is allowed
    if (isSocialLoginActive) {
      await firebaseSetup();
      console.log("Firebase initialized");
    }
});





app.use(express.json());
app.use(cookieParser());

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.status) {
      // If the error has a status property, use it as the HTTP status code
      return res.status(err.status).json({
        success: false,
        status: err.status,
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    } else {
      // Default to 500 for unexpected situations
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
);

app.use("/api/auth", router);
