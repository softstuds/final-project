import type {HydratedDocument} from 'mongoose';
import type { Industry } from './model';

export type IndustryResponse = {
    _id: string;
    userId: string;
    industryType: string;
}

/**
 * Transform a raw Industry object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Industry>} industry - An industry object
 * @returns {IndustryResponse} - The industry object
 */
 const constructIndustryResponse = (industry: HydratedDocument<Industry>): IndustryResponse => {
    const industryCopy: Industry = {
      ...industry.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };

    return {
      ...industryCopy,
      _id: industryCopy._id.toString(),
      userId: industryCopy.userId.toString()
    };
  };
  
  export {
    constructIndustryResponse
  };