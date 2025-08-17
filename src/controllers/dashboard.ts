
import { TryCatch } from "../middlewares/error.js";
import { Request, Response } from "express";

import  Dashboard from "../models/dasboard.js"
import { User } from "../models/user.js";

export const dashboard = TryCatch(async (req: Request, res: Response) => {
  try {
    const data = await Dashboard.find();
    const totaluser = await User.countDocuments();
    res.json({ success: true, data,totaluser });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});



