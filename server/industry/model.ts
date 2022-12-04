import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
            'This f'ile defines the properties stored in Industry
 */

// Type definition for Industry on the backend
export type Industry = {
    _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
    userId: Types.ObjectId;
    industryType: string; 
}

// Mongoose schema definition
const IndustrySchema = new Schema({
    // The userId
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // the industry type selected for the user
    industryType: {
        type: String,
        enum: [
            'Unspecified',
            'Agriculture',
            'Arts',
            'Construction',
            'Consumer Goods',
            'Corporate Services',
            'Design',
            'Education',
            'Energy & Mining',
            'Entertainment',
            'Finance',
            'Hardware & Networking',
            'Healthcare',
            'Legal',
            'Manufacturing',
            'Media & Communications',
            'Non-Profit',
            'Public Administration',
            'Public Safety',
            'Real Estate',
            'Recreation & Travel',
            'Retail',
            'Software & IT Services',
            'Transportation & Logistics',
            'Wellness & Fitness'
        ],
        default: 'Unspecified',
        required: true
    }
});

const IndustryModel = model<Industry>('Industry', IndustrySchema);
export default IndustryModel;