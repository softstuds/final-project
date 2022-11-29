import type {HydratedDocument, Types} from 'mongoose';
import type {Industry} from './model';
import IndustryModel from './model';

/**
 * This file contains a class with functionality to interact with industry objects stored in MongoDB 
 */

class IndustryCollection {
    /**
     * Add a new Industry object. Created when a user is created
     */
    static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Industry>> {
        const industry = new IndustryModel({userId: userId});
        await industry.save();
        return industry;
    }

    /**
     * Modify the industry of a user
     */
    static async updateOne(userId: Types.ObjectId | string, newIndustry: string): Promise<HydratedDocument<Industry>> {
        const industry = await IndustryModel.findOne({userId});
        industry.industryType = newIndustry;
        await industry.save();
        return industry;
    }

    /**
     * Find all Industry objects that correspond to a certain industry
     */
    static async findAllByIndustry(industryValue: string): Promise<Array<HydratedDocument<Industry>>> {
        const industry = await IndustryModel.find({industryType: industryValue});
        return industry;
    }

    /**
     * Delete Industry object. Deletes when a user is deleted
     */
    static async deleteOne(userId: Types.ObjectId | string) {
        const industry = await IndustryModel.deleteOne({userId});
        return industry !== null;
    }
}

export default IndustryCollection;