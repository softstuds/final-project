/* eslint-disable @typescript-eslint/indent */
import type {Request, Response} from 'express';
import express from 'express';
import TagsCollection from './collection';
import * as util from './util';
import * as tagsValidator from './middleware';

const router = express.Router();

/**
 * Create tags for a user
 * 
 * @name POST /api/tags
 * 
 * @return {TagsResponse} - The new created tags
 * @throws {409} - If tags already exist for the user
 */
router.post(
    '/',
    [tagsValidator.isTagsExistForCreation],
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
 * @name GET /api/tags/:userId
 * @return {TagsResponse} - The tags for a user
 */
router.get(
    '/:userId?',
    [],
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
 * @throws {400} - If the tag name is not valid
 */
 router.get(
    '/:tagName',
    [tagsValidator.isValidTagName],
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
 * @throws {400} - If the tag name is not valid
 */
 router.put(
    '/',
    [tagsValidator.isValidTagNameInBody],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const tags = await TagsCollection.updateOne(userId, req.body.tagName, req.body.newValue === 'true');
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
 * @throws {409} - if the tags do not exist for a particular user
 */
 router.delete(
    '/',
    [tagsValidator.isTagsExistForDeletion],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        await TagsCollection.deleteOne(userId);
        res.status(200).json({
            message: 'The tags were deleted successfully.'
        });
    }
);

export {router as tagsRouter};


