import express from "express";
import * as festivalController from '../controllers/festival.js';

const app = express.Router();

// Get all festivals
app.get('/get', festivalController.getFestivals);

// Get a single festival by ID
app.get('/:id', festivalController.getFestivalById);

// Create a new festival
app.post('/create', festivalController.createFestival);

// Update a festival by ID
app.put('/:id', festivalController.updateFestival);

// Delete a festival by ID
app.delete('/:id', festivalController.deleteFestival);

export default app;
