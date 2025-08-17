import express from "express";
import {
  newUser,
  registerUser,
  loginUser,
  removeCredits,
  getUser
 
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();

app.post("/new", newUser);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/remove", adminOnly,removeCredits);
app.get("/get", adminOnly,getUser);




export default app;
