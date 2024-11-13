import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

// console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));