import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO as string);
//     console.log("connected to mongoDB");
//   } catch (error) {
//     throw error;
//   }
// };

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

app.use(cookieParser());
app.use(express.json());

app.use((err: any, req: any, res: any, next: any) => {
  const errorStatus: number = err.status || 500;
  const errorMessage: string = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// app.listen(process.env.PORT, ()=>{
//    connect()
//    console.log("connected to backend")
// })
