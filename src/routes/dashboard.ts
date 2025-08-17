import express from "express";

import {dashboard} from "../controllers/dashboard.js";


const app = express.Router();

// route - /api/v1/dashboard
app.get("/get",dashboard)


export default app;
