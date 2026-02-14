// Packages
import express from "express";
import cors from "cors";
import "dotenv/config";

// Local Imports
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import resumeRoute from "./routes/resumeRoutes.js";
import aiRoute from "./routes/aiRoutes.js";

// Middleware
const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
connectDB();

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users",userRoute);
app.use("/api/resumes",resumeRoute);
app.use("/api/ai",aiRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
