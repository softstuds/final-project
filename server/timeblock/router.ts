import type {Request, Response} from 'express';
import express from 'express';
import TimeBlockCollection from './collection';
import * as userValidator from '../user/middleware';
import * as timeBlockValidator from '../timeblock/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the time blocks for a user
 *
 * @name GET /api/timeblock
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks for the user 
 *                      sorted in descending order by start
 * @throws {404} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const allTimeBlocks = await TimeBlockCollection.findAllByUser(userId);
    const response = allTimeBlocks.map(util.constructTimeBlockResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all the time blocks that a user needs to mark as occurred/not
 *
 * @name GET /api/timeblock/checkoccurred
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks for the user 
 *                      to mark as occurred, sorted in descending order by start
 * @throws {404} - If the user is not logged in
 */
 router.get(
    '/checkoccurred',
    [
      userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const occurredTimeBlocks = await TimeBlockCollection.findAllByUserOccurred(userId);
      const response = occurredTimeBlocks.map(util.constructTimeBlockResponse);
      res.status(200).json(response);
    }
  );


/**
 * Get all the time blocks that a given user has unclaimed
 *
 * @name GET /api/timeblock/unclaimed/:userId
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks for the user 
 *                      to mark as occurred, sorted in descending order by start
 * @throws {404} - If the user is not logged in
 * @throws {404} - If the userId is not a valid one
 */
 router.get(
    '/unclaimed/:userId?',
    [
      userValidator.isUserLoggedIn,
      timeBlockValidator.isValidUserParam,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.params.userId as string);
      const unclaimedTimeBlocks = await TimeBlockCollection.findAllByOwnerUnclaimed(userId);
      const response = unclaimedTimeBlocks.map(util.constructTimeBlockResponse);
      res.status(200).json(response);
    }
  );

/**
 * Create a new freet.
 *
 * @name PUT /api/timeblock
 *
 * @param {string} start - The start time of the time block
 * @return {TimeBlockResponse} - The created time block
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user already has a time block with the given start time
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isBlockNonexistent,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const timeBlock = await TimeBlockCollection.addOne(userId, req.body.start);

    res.status(201).json({
      message: 'Your time block was created successfully.',
      timeBlock: util.constructTimeBlockResponse(timeBlock)
    });
  }
);

/**
 * Delete a time block
 *
 * @name DELETE /api/timeblock/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or user is not block owner
 * @throws {404} - If the time block with given ID does not exist
 */
router.delete(
  '/:timeBlockId?',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isBlockExistent,
    timeBlockValidator.isBlockOwner,
  ],
  async (req: Request, res: Response) => {
    const deleted = await TimeBlockCollection.deleteOne(req.params.timeBlockId);
    res.status(200).json({
      message: `${deleted ? 'Your time block was deleted successfully.' : 'Unable to delete time block.'}`
    });
  }
);

/**
 * Modify a time block by sending a request to meet
 *
 * @name PATCH /api/timeblock/request/:id
 *
 * @param {string} userId - the userId of the requester
 * @return {TimeBlockResponse} - the updated time block
 * @throws {400} - If the user is not given
 * @throws {403} - if the user is not logged in or is already the owner of the time block
 * @throws {404} - If either the time block or the user with given ID does not exist
 * @throws {409} - If the time block has already passed
 */
router.patch(
  '/request/:timeBlockId?',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isUserGiven,
    timeBlockValidator.isValidUserBody,
    timeBlockValidator.isBlockExistent,
    timeBlockValidator.isBlockInFuture,
    timeBlockValidator.isBlockNotOwner,
  ],
  async (req: Request, res: Response) => {
    const timeBlock = await TimeBlockCollection.updateOneRequest(req.params.timeBlockId, req.body.userId);
    res.status(200).json({
      message: 'Your time block was updated successfully.',
      timeBlock: util.constructTimeBlockResponse(timeBlock)
    });
  }
);

/**
 * Modify a time block by accepting or rejecting it
 *
 * @name PATCH /api/timeblock/accepted/:id
 *
 * @param {boolean} input - the response of the owner
 * @return {TimeBlockResponse} - the updated time block
 * @throws {403} - if the user is not logged in or user is not block owner
 * @throws {404} - If either the time block with given ID does not exist or the input is not valid
 */
 router.patch(
    '/accepted/:timeBlockId?',
    [
      userValidator.isUserLoggedIn,
      timeBlockValidator.isBlockExistent,
      timeBlockValidator.isBlockOwner,
      timeBlockValidator.isValidInput,
    ],
    async (req: Request, res: Response) => {
      if (req.body.input) {
        const timeBlock = await TimeBlockCollection.updateOneAccepted(req.params.timeBlockId);
        res.status(200).json({
          message: 'The request was accepted successfully.',
          timeBlock: util.constructTimeBlockResponse(timeBlock),
        });
      } else {
        // keep accepted false, change claimed to false and requester to null
        const timeBlock = await TimeBlockCollection.updateOneRequest(req.params.timeBlockId, null);
        res.status(200).json({
            message: 'The request was rejected successfully.',
            timeBlock: util.constructTimeBlockResponse(timeBlock),
        });
      }
    }
  );

/**
 * Modify a time block by marking a meeting as occurred or not
 *
 * @name PATCH /api/timeblock/occurred/:id
 *
 * @param {boolean} input - the response of the owner or requester
 * @return {TimeBlockResponse} - the updated time block
 * @throws {403} - if the user is not logged in or user is not owner or requester
 * @throws {404} - If either the time block with given ID does not exist or the input is not valid
 * @throws {409} - If the time block start has not passed yet or is not an accepted meeting
 */
router.patch(
    '/occurred/:timeBlockId?',
    [
      userValidator.isUserLoggedIn,
      timeBlockValidator.isBlockExistent,
      timeBlockValidator.isBlockAccepted,
      timeBlockValidator.isBlockOwnerOrRequester,
      timeBlockValidator.isBlockInPast,
      timeBlockValidator.isValidInput,
    ],
    async (req: Request, res: Response) => {
      const timeBlock = await TimeBlockCollection.updateOneOccurred(req.params.timeBlockId, req.body.input);
      res.status(200).json({
        message: 'Your meeting status was updated successfully.',
        timeBlock: util.constructTimeBlockResponse(timeBlock),
      });
    }
  );

export {router as timeBlockRouter};
