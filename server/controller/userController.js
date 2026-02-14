import User from "../models/User.js";
import Resume from "../models/Resume.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// User registration : Post /api/users/register 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
     res.status(500).json({ message: error.message || "Server error" });
  }
};

// User login : Post /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Generate token
    const token = generateToken(user._id);
    user.password = undefined; // Hide password in response
    res.status(200).json({ message: "Login successfull ", token, user });

  } catch (error) {
     res.status(500).json({ message: error.message || "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // For stateless JWT authentication, logout can be handled on the client side by deleting the token.
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
     res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get user details : Get /api/users/profile
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId; // Assuming user ID is stored in req.user by auth middleware
        const user = await User.findById(userId).select("-password"); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
         res.status(500).json({ message: error.message || "Server error" });
    }
};

// Get user Resume : Get /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId; // Assuming user ID is stored in req.user by auth middleware
        const resumes = await Resume.find({ userId }); // Fetch resumes based on user ID
        res.status(200).json({ resumes });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};