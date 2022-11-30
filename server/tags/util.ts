/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type { Tags } from './model';

type TagsResponse = {
    _id: string; // MongoDB automatically generates ID
    userId: string;
    coffeeChat: Boolean;
    refer: Boolean;
    helpInterview: Boolean;
    resumeReview: Boolean;
    mentor: Boolean;
    email: Boolean;
};

/**
 * Transforms a raw Tags object from the database into an object
 */
 const constructTagsResponse = (tags: HydratedDocument<Tags>): TagsResponse => {
    const tagsCopy: Tags = {
        ...tags.toObject({
            versionKey: false
        })
    };

    return {
        ...tagsCopy,
        _id: tagsCopy._id.toString(),
        userId: tagsCopy.userId.toString(),
        coffeeChat: tagsCopy.coffeeChat,
        refer: tagsCopy.refer,
        helpInterview: tagsCopy.helpInterview,
        resumeReview: tagsCopy.resumeReview,
        mentor: tagsCopy.mentor,
        email: tagsCopy.email
    };
};

export {
    constructTagsResponse
};