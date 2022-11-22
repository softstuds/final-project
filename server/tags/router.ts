/* eslint-disable @typescript-eslint/indent */
import type {Request, Response} from 'express';
import express from 'express';
import TagsCollection from './collection';
import * as util from './util';

const router = express.Router();

/**
 * Create tags for a user
 * 
 * @name POST /api/tags
 * 
 * @return 
 */
router.post(
    '/',
    [],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const tags = await TagsCollection.addOne(userId);
        res.status(201).json({
            message: 'Tags were created successfully.',
            category: util.constructTagsResponse(tags)
        });
    }
);

/**
 * Retrieve a user's tags
 * 
 * @name GET /api/tags
 */
router.get(
    '/',
    [],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const tags = await TagsCollection.findOneByUserId(userId);
        res.status(201).json({
            message: 'Tags were retrieved successfully.',
            category: util.constructTagsResponse(tags)
        });
    }
);

/**
 * Retrieve all tags when a specific value is true
 * 
 * @name GET /api/tags/:tagName
 */
 router.get(
    '/:tagName',
    [],
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
 */
 router.put(
    '/',
    [],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const tags = await TagsCollection.updateOne(userId, req.body.tagName, req.body.newValue === 'true');
        res.status(201).json({
            message: 'Tags were updated successfully.',
            category: util.constructTagsResponse(tags)
        });
    }
);

/**
 * Update a user's tags
 * 
 * @name DELETE /api/tags
 */
 router.delete(
    '/',
    [],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        await TagsCollection.deleteOne(userId);
        res.status(200).json({
            message: 'The tags were deleted successfully.'
        });
    }
);


