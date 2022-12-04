/* eslint-disable @typescript-eslint/indent */
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TagsCollection from './collection';

/**
 * Check to make sure tagName is a valid tag name
 */
const isValidTagName = async (req: Request, res: Response, next: NextFunction) => {
    const validNames = ['coffeeChat', 'refer', 'helpInterview', 'resumeReview', 'mentor', 'email'];
    if (!validNames.includes(req.params.tagName)) {
        res.status(400).json({
            error: 'Category must be a string only consisting of letters and numbers.'
        });
        return;
    }
    next();
};

/**
 * Check to make sure tagName is valid when it is in the body
 */
 const isValidTagNameInBody = async (req: Request, res: Response, next: NextFunction) => {
    const validNames = ['coffeeChat', 'refer', 'helpInterview', 'resumeReview', 'mentor', 'email'];
    if (!validNames.includes(req.body.tagName)) {
        res.status(400).json({
            error: 'Category must be a string only consisting of letters and numbers.'
        });
        return;
    }
    next();
};

/**
 * Check to make sure tags don't already exist for a user during creation
 */
const isTagsExistForCreation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const tags = await TagsCollection.findOneByUserId(userId);
    if (tags) {
        res.status(409).json({
            error: `Tags already exist for this account`
        });
        return;
    }
    next();
};

/**
 * Check to make sure tags exist for deletion
 */
 const isTagsExistForDeletion = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const tags = await TagsCollection.findOneByUserId(userId);
    if (!tags) {
        res.status(409).json({
            error: `Tags do not exist for this account`
        });
        return;
    }
    next();
};

export {
    isValidTagName,
    isValidTagNameInBody,
    isTagsExistForCreation,
    isTagsExistForDeletion
}