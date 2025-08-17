import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const JWT_SECRET ='your-secret-key';
// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) return next(new ErrorHandler("User not logged in", 401));
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(token)
    const user = await User.findById((decoded as jwt.JwtPayload).id);

    if (!user) return next(new ErrorHandler("ID is invalid", 401));

    req.body.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
});
