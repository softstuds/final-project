/* eslint-disable @typescript-eslint/indent */
import type {Request, Response} from 'express';
import express from 'express';
import TagsCollection from './collection';
import * as util from './util';
import * as tagsValidator from './middleware';
import * as userValidator from '../user/middleware';

const router = express.Router();

/**
 * Create tags for a user
 * 
 * @name POST /api/tags
 * 
 * @return {TagsResponse} - The new created tags
 * @throws {403} - If the user is not logged in
 * @throws {409} - If tags already exist for the user
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        tagsValidator.isTagsExistForCreation
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const tags = await TagsCollection.addOne(userId);
        res.status(201).json({
            message: 'Tags were created successfully.',
            tags: util.constructTagsResponse(tags)
        });
    }
);

/**
 * Retrieve a user's tags
 * 
 * @name GET /api/tags/users/:userId
 * @throws {403} - If the user is not logged in
 * @return {TagsResponse} - The tags for a user
 */
router.get(
    '/users/:userId?',
    [userValidator.isUserLoggedIn],
    async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const tags = await TagsCollection.findOneByUserId(userId);
        res.status(201).json({
            message: 'Tags were retrieved successfully.',
            tags: util.constructTagsResponse(tags)
        });
    }
);

/**
 * Retrieve all tags when a specific value is true
 * 
 * @name GET /api/tags/:tagName
 * @return {TagsResponse[]} - All tags that have the value as true
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the tag name is not valid
 */
 router.get(
    '/:tagName?',
    [
        userValidator.isUserLoggedIn,
        tagsValidator.isValidTagName
    ],
    async (req: Request, res: Response) => {
        const tags = await TagsCollection.findAllByTag(req.params.tagName);
        const response = tags.map(util.constructTagsResponse);
        res.status(200).json(response);
    }
);

/**
 * Update a user's tags
 * 
 * @name PUT /api/tags
 * @return {TagsResponse} - The updated tags
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the tag name is not valid
 */
 router.put(
    '/',
    [
        userValidator.isUserLoggedIn,
        tagsValidator.isValidTagNameInBody
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const tags = await TagsCollection.updateOne(userId, req.body.tagName, req.body.newValue);
        res.status(201).json({
            message: 'Tags were updated successfully.',
            tags: util.constructTagsResponse(tags)
        });
    }
);

/**
 * Delete a user's tags
 * 
 * @name DELETE /api/tags
 * @return {boolean} - A boolean value indicating if the tags were deleted
 * @throws {403} - If the user is not logged in
 * @throws {409} - if the tags do not exist for a particular user
 */
 router.delete(
    '/',
    [
        userValidator.isUserLoggedIn,
        tagsValidator.isTagsExistForDeletion
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        await TagsCollection.deleteOne(userId);
        res.status(200).json({
            message: 'The tags were deleted successfully.'
        });
    }
);

export {router as tagsRouter};


