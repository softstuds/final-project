import type {Request, Response} from 'express';
import express from 'express';
import IndustryCollection from './collection';
import * as util from './util';
import * as industryValidator from '../industry/middleware';
import * as userValidator from '../user/middleware';


const router = express.Router();

/**
 * Creates an Industry object
 * 
 * @name POST /api/industry
 * @throws {403} - If user is not logged in
 * @throws {409} - If the industry object already exists
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        industryValidator.isIndustryExistForCreation
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
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
 * @throws {403} - If user is not logged in
 * @throws {409} - If the industry object does not exist
 * @throws {400} - If the industry value is valid
 */
 router.put(
    '/',
    [
        userValidator.isUserLoggedIn,
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
 * @throws {403} - If user is not logged in
 * @throws {400} - If the industry value is valid
 */
 router.get(
    '/:industryValue?',
    [
        userValidator.isUserLoggedIn,
        industryValidator.isValidIndustryValue
    ],
    async (req: Request, res: Response) => {
        const industries = await IndustryCollection.findAllByIndustry(req.params.industryValue);
        const response = industries.map(util.constructIndustryResponse);
        res.status(200).json(response);
    }
);

/**
 * Gets Industry object for a specific user
 * 
 * @name GET /api/industry/users/:userId
 * 
 * @throws {403} - If user is not logged in
 * @throws {404} - If the user does not exist
 */
 router.get(
    '/users/:userId?',
    [
        userValidator.isUserExists,
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const industry = await IndustryCollection.findOne(req.params.userId);
        res.status(200).json({
            message: 'Your industry info was found successfully.',
            industry: industry
         });
    }
);

/**
 * Deletes an Industry object
 * 
 * @name DELETE /api/industry
 * @throws {403} - If user is not logged in
 * @throws {409} - If the industry object does not exist
 */
 router.delete(
    '/',
    [
        userValidator.isUserLoggedIn,
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