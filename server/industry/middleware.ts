import type {Request, Response, NextFunction} from 'express';
import IndustryCollection from './collection';

/**
 * Checks if an industry object is already created (for creating another one)
 */
const isIndustryExistForCreation = async (req: Request, res: Response, next: NextFunction) => {
    const industry = await IndustryCollection.findOne(req.session.userId);
    if (industry) {
        res.status(409).json({
            error: `Industry already exists for user.`
          });
          return;
        }
      
        next();
};

/**
 * Checks if an industry object exists(for deletion)
 */
 const isIndustryExistForDeletion = async (req: Request, res: Response, next: NextFunction) => {
    const industry = await IndustryCollection.findOne(req.session.userId);
    if (!industry) {
        res.status(409).json({
            error: `Industry does not exist for user.`
          });
          return;
        }
      
        next();
};

/**
 * Checks to see if the industry value inputted is valid
 */
const isValidIndustryValue = async (req: Request, res: Response, next: NextFunction) => {
    const validIndustries = [
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
    ];
    if (!validIndustries.includes(req.params.industryValue)) {
        res.status(400).json({
            error: `Industry given is not a valid industry name.`
          });
          return;
    }
    next();
};

/**
 * Checks to see if the industry value inputted in body is valid
 */
 const isValidNewIndustry = async (req: Request, res: Response, next: NextFunction) => {
    const validIndustries = [
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
    ];
    if (!validIndustries.includes(req.body.newIndustry)) {
        res.status(400).json({
            error: `Industry given is not a valid industry name.`
          });
          return;
    }
    next();
};



export {
    isIndustryExistForCreation,
    isIndustryExistForDeletion,
    isValidIndustryValue,
    isValidNewIndustry
}