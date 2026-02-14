import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    const mongoUI = process.env.MONGO_URI;
    const projectName = 'resume-builder';
    await mongoose.connect(`${mongoUI}/${projectName}` );
     
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  } 
};

export default connectDB;