import type {Request, Response} from 'express';
import express from 'express';
import IndustryCollection from './collection';
import * as util from './util';
import * as industryValidator from '../industry/middleware';


const router = express.Router();

/**
 * Creates an Industry object
 * 
 * @name POST /api/industry
 */
router.post(
    '/',
    [industryValidator.isIndustryExistForCreation],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        // const userId = req.body.userId;
        const industry = await IndustryCollection.addOne(userId);
        res.status(200).json({
            message: 'Your industry info was created successfully.',
            industry: industry
         });
    }
);

/**
 * Updates an Industry object
 * 
 * @name PUT /api/industry
 */
 router.put(
    '/',
    [
        industryValidator.isIndustryExistForDeletion,
        industryValidator.isValidNewIndustry
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const industry = await IndustryCollection.updateOne(userId, req.body.newIndustry);
        res.status(200).json({
            message: 'Your industry info was updated successfully.',
            industry: industry
         });
    }
);

/**
 * Gets all industry objects with a certain industry value
 * 
 * @name GET /api/industry/:industryValue
 */
 router.get(
    '/:industryValue?',
    [
        industryValidator.isValidIndustryValue
    ],
    async (req: Request, res: Response) => {
        const industries = await IndustryCollection.findAllByIndustry(req.params.industryValue);
        const response = industries.map(util.constructIndustryResponse);
        res.status(200).json(response);
    }
);

/**
 * Deletes an Industry object
 * 
 * @name DELETE /api/industry
 */
 router.delete(
    '/',
    [
        industryValidator.isIndustryExistForDeletion
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const industry = await IndustryCollection.deleteOne(userId);
        res.status(200).json({
            message: 'Your industry info was deleted successfully.'
         });
    }
);

export {router as industryRouter};