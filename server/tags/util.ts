/* eslint-disable @typescript-eslint/indent */
import type {HydratedDocument, Types} from 'mongoose';
import type { Tags } from './model';

type TagsResponse = {
    _id: string; // MongoDB automatically generates ID
    userId: string;
    coffeeChat: string;
    refer: string;
    helpInterview: string;
    resumeReview: string;
    mentor: string;
    email: string;
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
        coffeeChat: tagsCopy.coffeeChat.toString(),
        refer: tagsCopy.refer.toString(),
        helpInterview: tagsCopy.helpInterview.toString(),
        resumeReview: tagsCopy.resumeReview.toString(),
        mentor: tagsCopy.mentor.toString(),
        email: tagsCopy.email.toString()
    };
};

export {
    constructTagsResponse
};