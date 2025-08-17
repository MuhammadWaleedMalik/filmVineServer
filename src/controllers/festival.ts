import { Request, Response } from 'express';
import Festival, { IFestival } from '../models/festivals.js';

// Create a new festival
export const createFestival = async (req: Request, res: Response) => {
    try {
        const festival = new Festival(req.body);
        const savedFestival = await festival.save();
        res.status(201).json(savedFestival);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// Get all festivals
export const getFestivals = async (_req: Request, res: Response) => {
    try {
        const festivals = await Festival.find();
        res.json(festivals);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get a single festival by ID
export const getFestivalById = async (req: Request, res: Response) => {
    try {
        const festival = await Festival.findById(req.params.id);
        if (!festival) {
            return res.status(404).json({ message: 'Festival not found' });
        }
        res.json(festival);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update a festival by ID
export const updateFestival = async (req: Request, res: Response) => {
    try {
        const festival = await Festival.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!festival) {
            return res.status(404).json({ message: 'Festival not found' });
        }
        res.json(festival);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// Delete a festival by ID
export const deleteFestival = async (req: Request, res: Response) => {
    try {
        const festival = await Festival.findByIdAndDelete(req.params.id);
        if (!festival) {
            return res.status(404).json({ message: 'Festival not found' });
        }
        res.json({ message: 'Festival deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};