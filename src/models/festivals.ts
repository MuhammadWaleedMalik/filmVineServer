import { Schema, model, Document } from 'mongoose';

export interface IFestival extends Document {
    name: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    contactEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

const FestivalSchema = new Schema<IFestival>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        contactEmail: { type: String, required: true },
    },
    { timestamps: true }
);

export default model<IFestival>('Festival', FestivalSchema);