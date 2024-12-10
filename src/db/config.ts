import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/vidDB");
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB");
  }
};
