import type {HydratedDocument, Types} from 'mongoose';
import type { Tags } from './model';
import TagsModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with Tags stored in MongoDB
 */

class TagsCollection {
    /**
     * Create a new tags object.
     * 
     * @param userId the username of the user
     */
    static async addOne(userId: string): Promise<HydratedDocument<Tags>> {
        const tags = new TagsModel({userId: userId});
        await tags.save();
        return tags;
    }

    /**
     * Find a user's categories
     * 
     * @param username the username of the user
     */
    static async findOneByEmail(username: string): Promise<HydratedDocument<Tags>> {
        const user = await UserCollection.findOneByEmail(username);
        const tags = await TagsModel.findOne({userId: user._id});
        return tags;
    }

    /**
     * Find a user's categories by their userId
     * 
     * @param userId the userId of the user
     */
    static async findOneByUserId(userId: string): Promise<HydratedDocument<Tags>> {
        const tags = await TagsModel.findOne({userId: userId});
        return tags;
    }

    /**
     * Find all tags where a certain tag is true
     * 
     * @param tagName the tag value
     */
     static async findAllByTag(tagName: string): Promise<Array<HydratedDocument<Tags>>> {
        let tags: Array<HydratedDocument<Tags>> = [];
        if (tagName === 'coffeeChat') {
            tags = await TagsModel.find({coffeeChat: true});
        }

        if (tagName === 'refer') {
            tags = await TagsModel.find({refer: true});
        }

        if (tagName === 'helpInterview') {
            tags = await TagsModel.find({helpInterview: true});
        }

        if (tagName === 'resumeReview') {
            tags = await TagsModel.find({resumeReview: true});
        }

        if (tagName === 'mentor') {
            tags = await TagsModel.find({mentor: true});
        }

        if (tagName === 'email') {
            tags = await TagsModel.find({email: true});
        }
        return tags;
    }

    /**
     * Delete all of a user's tags
     * 
     * @param userId the userId of the user
     */
    static async deleteOne(userId: string): Promise<boolean> {
        const tags = await TagsModel.deleteOne({userId: userId});
        return tags !== null;
    }

    /**
     * Update a user's tag selection
     * 
     * @param userId the userId of the user
     * @param tagName the name of the tag to be changed
     * @param newValue the new value of the tag
     */
    static async updateOne(userId: string, tagName: string, newValue: boolean) {
        const tags = await TagsModel.findOne({userId: userId});
        if (tagName === 'coffeeChat') {
            tags.coffeeChat = newValue
        }

        if (tagName === 'refer') {
            tags.refer = newValue
        }

        if (tagName === 'helpInterview') {
            tags.helpInterview = newValue
        }

        if (tagName === 'resumeReview') {
            tags.resumeReview = newValue
        }

        if (tagName === 'mentor') {
            tags.mentor = newValue
        }

        if (tagName === 'email') {
            tags.email = newValue
        }

        await tags.save();
        return tags;
    }
}

export default TagsCollection;