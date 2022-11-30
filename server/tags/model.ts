import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in Tags
 */
export type Tags = {
    _id: Types.ObjectId; // MongoDB automatically generates ID
    userId: Types.ObjectId;
    coffeeChat: Boolean;
    refer: Boolean;
    helpInterview: Boolean;
    resumeReview: Boolean;
    mentor: Boolean;
    email: Boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
const TagsSchema = new Schema<Tags>({
    // the userId the tags apply to
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // if a user is open to coffee chatting
    coffeeChat: {
        type: Boolean,
        required: true,
        default: false
    },
    // if a user is open to refer
    refer: {
        type: Boolean,
        required: true,
        default: false
    },
    // if a user is open to interviewing
    helpInterview: {
        type: Boolean,
        required: true,
        default: false
    },
    // if a user is open to resume reviewing
    resumeReview: {
        type: Boolean,
        required: true,
        default: false
    },
    // if a user is open to mentoring
    mentor: {
        type: Boolean,
        required: true,
        default: false
    },
    // if a user is open to emailing
    email: {
        type: Boolean,
        required: true,
        default: false
    }
});

const TagsModel = model<Tags>('Tags', TagsSchema);
export default TagsModel;