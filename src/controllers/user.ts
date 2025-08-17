import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import Dashboard from "../models/dasboard.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = "your-secret-key";
import axios from "axios";

const API_KEY = "mzp3e7myqekrzwm96uhmau7vk4ribiyp";


export const newUser = TryCatch(
  async (
    req: Request<{}, {}, { name: string; email: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email } = req.body;

    // Validate input fields
    if (!name || !email) {
      return next(new ErrorHandler("Please add all fields", 400));
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, email: user.email }, // Payload
        JWT_SECRET,
         );
  
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
        token
      });
    }

    // If the user does not exist, create a new user
    user = await User.create({
      name,
      email,
    });

    // Update the Dashboard document
    const dashboard = await Dashboard.findOneAndUpdate(
      {}, // Assuming there's only one dashboard document
      {
        $inc: {
          totalUsers: 1, // Increment total users by 1
          usersThisMonth: 1, // Increment users this month by 1
        },
      },
      { new: true, upsert: true } // Return the updated document and create if it doesn't exist
    );
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET,
       );

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`, 
      user,
      token
      });
  }
);

export const registerUser = TryCatch(
  async (
    req: Request<{}, {}, {  email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const {  email, password } = req.body;
    

    // Validate input fields
    if ( !email || !password) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }
    
    const name=email.split('@')[0]

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Update the Dashboard document
    const dashboard = await Dashboard.findOneAndUpdate(
      {}, // Assuming there's only one dashboard document
      {
        $inc: {
          totalUsers: 1, // Increment total users by 1
          usersThisMonth: 1, // Increment users this month by 1
        },
      },
      { new: true, upsert: true } // Return the updated document and create if it doesn't exist
    );

    return res.status(201).json({
      success: true,
      message: `User registered successfully`,
      user: {
        id: user._id,
        email: user.email,
      },
      // Optionally include the updated dashboard in the response
    });
  }
);

export const loginUser = TryCatch(
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    // Check if the user exists
    const user = await User.findOne({ email }); // Include password field
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET,
       );

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user,
      token, // Include the JWT token in the response
    });
  }
);



export const removeCredits = TryCatch(async (req: Request, res: Response) => {
  try {
    const { user: requestBodyUser } = req.body;
    const userId = requestBodyUser?._id;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.credits < 5) {
      return res.status(400).json({ success: false, error: "Not enough credits" });
    }

    user.credits -= 3;
    await user.save();

    res.status(200).json({ success: true, message: "5 credits removed", credits: user.credits });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


export const getUser = TryCatch(async (req: Request, res: Response) => {
  const { user: requestBodyUser } = req.body;
    const userId = requestBodyUser?._id;
    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }
  const user = await User.find(userId);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }
  return res.status(201).json({
    success: true,
    user
    });
});


