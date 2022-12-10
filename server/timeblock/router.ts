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
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const allTimeBlocks = await TimeBlockCollection.findAllByUser(userId);
    const response = allTimeBlocks.map(util.constructTimeBlockResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all the upcoming meetings (meetings that have been accepted and haven't
 * happened yet for a user)
 *
 * @name GET /api/timeblock/upcoming
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks of upcoming meetings for the user
 *                      sorted in descending order by start
 * @throws {403} - If the user is not logged in
 */
 router.get(
  '/upcoming',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const allTimeBlocks = await TimeBlockCollection.findAllByUserAccepted(userId);
    const response = allTimeBlocks.map(util.constructTimeBlockResponse);
    res.status(200).json(response);
  }
);

/**
 * Whether signed in user has access
 *
 * @name GET /api/timeblock/access/
 *
 * @return {Boolean} - Whether of not the user has access
 * @throws {403} - If the user is not logged in
 */
 router.get(
  '/access/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const hasAccess = await TimeBlockCollection.findAccessStatus(userId);
    res.status(200).json({hasAccess});
  }
);

/**
 * Get all the time blocks that a user needs to mark as met/not
 *
 * @name GET /api/timeblock/met/check
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks for the user 
 *                      to mark as met, sorted in descending order by start
 * @throws {403} - If the user is not logged in
 */
 router.get(
    '/met/check',
    [
      userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const unMarkedTimeBlocks = await TimeBlockCollection.findAllByUserOccurred(userId);
      const response = unMarkedTimeBlocks.map(util.constructTimeBlockResponse);
      res.status(200).json(response);
    }
  );

/**
 * Get all the time blocks that a given user has unclaimed
 *
 * @name GET /api/timeblock/unclaimed/:userId
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks that are unclaimed
 *                          for the user, sorted in descending order by start
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the userId is not a valid one
 */
router.get(
  '/unclaimed/:userId?',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isValidUserParam
  ],
  async (req: Request, res: Response) => {
    const {userId} = req.params;
    const unclaimedTimeBlocks = await TimeBlockCollection.findAllByOwnerUnclaimed(userId);
    const response = unclaimedTimeBlocks.map(util.constructTimeBlockResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all the unanswered meeting requests that a user has sent
 *
 * @name GET /api/timeblock/requests/sent
 *
 * @return {TimeBlockResponse[]} - A list of all the time blocks that the user is a
 *                        requester for but are unanswered, sorted in ascending order by start
 * @throws {403} - If the user is not logged in
 */
 router.get(
  '/requests/sent',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    const requestedTimeBlocks = await TimeBlockCollection.findAllRequests(userId, true);
    const response = requestedTimeBlocks.map(util.constructTimeBlockResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all the unanswered meeting requests that a user has received
 *
 * @name GET /api/timeblock/requests/received
 *
 * @return {TimeBlockResponse[]} - A list of all the requested time blocks that the user is as
 *                        owner for but are unanswered, sorted in ascending order by start
 * @throws {403} - If the user is not logged in
 */
 router.get(
  '/requests/received',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    const requestedTimeBlocks = await TimeBlockCollection.findAllRequests(userId, false);
    const response = requestedTimeBlocks.map(util.constructTimeBlockResponse);
    res.status(200).json(response);
  }
);

/**
 * Get the statistics for a given user, including total hours accepted (as owner) 
 * and meeting success rate (hours met / hours accepted)
 *
 * @name GET /api/timeblock/stats/:userId
 *
 * @return {TimeBlockResponse[]} - An object of all the statistics available for users to see
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the userId is not a valid one
 */
router.get(
  '/stats/:userId?',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isValidUserParam
  ],
  async (req: Request, res: Response) => {
    const {userId} = req.params;
    const totalHoursAccepted = await TimeBlockCollection.findTotalAcceptedByOwner(userId) as number;
    const totalHoursMet = await TimeBlockCollection.findTotalMetByOwner(userId) as number;
    const months = await TimeBlockCollection.findTotalMonthsByOwner(userId) as number;
    const averageMonthlyHours = (months) ? totalHoursAccepted / months : 0;
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const hoursThisMonth = await TimeBlockCollection.findTotalAcceptedByOwner(userId, firstDay);
    const meetingSuccessRate = (totalHoursAccepted) ? totalHoursMet / totalHoursAccepted * 100 : 100;
    const uniqueUsers = await TimeBlockCollection.findTotalUniqueMetByOwner(userId);
    res.status(200).json({
      message: 'Statistics were fetched successfully.',
      statistics: [
        {label: 'Total Hours Accepted', value: totalHoursAccepted},
        {label: 'Average Hours Accepted per Month', value: `${averageMonthlyHours.toFixed(2)}`},
        {label: 'Total Hours Accepted This Month', value: hoursThisMonth},
        {label: 'Meeting Success Rate', value: `${Math.round(meetingSuccessRate)}%`},
        {label: 'Unique Users Met', value: uniqueUsers},
      ]
    });
  }
);

/**
 * Create a new time block.
 *
 * @name PUT /api/timeblock
 *
 * @param {string} start - The start time of the time block
 * @return {TimeBlockResponse} - The created time block
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the user already has a time block with the given start time 
 *                or if the start time has already passed
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isBlockNonexistent,
    timeBlockValidator.isBlockInNextFour
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
    timeBlockValidator.isBlockOwner
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
    timeBlockValidator.isBlockNotOwner
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
 * Modify a time block by unsending a request to meet
 *
 * @name PATCH /api/timeblock/request/:id/unsend
 *
 * @return {TimeBlockResponse} - the updated time block
 * @throws {403} - if the user is not logged in or is not the requester of the time block
 * @throws {404} - If either the time block with given ID does not exist
 * @throws {409} - If the time block has already passed
 */
 router.patch(
  '/request/:timeBlockId?/unsend',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isBlockExistent,
    timeBlockValidator.isBlockInFuture,
    timeBlockValidator.isBlockRequester,
  ],
  async (req: Request, res: Response) => {
    const timeBlock = await TimeBlockCollection.updateOneRequest(req.params.timeBlockId, null);
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
    timeBlockValidator.isValidInput
  ],
  async (req: Request, res: Response) => {
    if (req.body.input) {
      const timeBlock = await TimeBlockCollection.updateOneAccepted(req.params.timeBlockId);
      // deletes any of a requester's unclaimed time blocks with the same start as the accepted block 
      const requesterTimeBlocks = await TimeBlockCollection.findAllByOwnerUnclaimed(timeBlock.requester._id);
      const sameTime = requesterTimeBlocks.filter((block) => block.start.getTime() == timeBlock.start.getTime());
      if (sameTime) {
        sameTime.map(async (block) => await TimeBlockCollection.deleteOne(block._id));
      }
      res.status(200).json({
        message: 'The request was accepted successfully.',
        timeBlock: util.constructTimeBlockResponse(timeBlock)
      });
    } else {
      // Keep accepted false, change claimed to false and requester to null
      const timeBlock = await TimeBlockCollection.updateOneRequest(req.params.timeBlockId, null);
      res.status(200).json({
        message: 'The request was rejected successfully.',
        timeBlock: util.constructTimeBlockResponse(timeBlock)
      });
    }
  }
);

/**
 * Modify a time block by canceling a meeting
 *
 * @name PATCH /api/timeblock/cancel/:id
 *
 * @return {TimeBlockResponse} - the updated time block
 * @throws {403} - If the user is not logged in or user is not owner or requester
 * @throws {404} - If the time block with given ID does not exist
 * @throws {409} - If the time block is not an accepted meeting
 */
 router.patch(
  '/cancel/:timeBlockId?',
  [
    userValidator.isUserLoggedIn,
    timeBlockValidator.isBlockExistent,
    timeBlockValidator.isBlockAccepted,
    timeBlockValidator.isBlockOwnerOrRequester,
  ],
  async (req: Request, res: Response) => {
    const timeBlock = await TimeBlockCollection.updateOneCancel(req.params.timeBlockId);
    res.status(200).json({
      message: 'Your meeting status was canceled successfully.',
      timeBlock: util.constructTimeBlockResponse(timeBlock),
    });
  }
);

/**
 * Modify a time block by marking a meeting as met or not
 *
 * @name PATCH /api/timeblock/met/:id
 *
 * @param {boolean} input - the response of the owner or requester
 * @return {TimeBlockResponse} - the updated time block
 * @throws {403} - if the user is not logged in or user is not owner or requester
 * @throws {404} - If either the time block with given ID does not exist or the input is not valid
 * @throws {409} - If the time block start has not passed yet or is not an accepted meeting
 */
router.patch(
    '/met/:timeBlockId?',
    [
      userValidator.isUserLoggedIn,
      timeBlockValidator.isBlockExistent,
      timeBlockValidator.isBlockAccepted,
      timeBlockValidator.isBlockOwnerOrRequester,
      timeBlockValidator.isBlockInPast,
      timeBlockValidator.isValidInput,
    ],
    async (req: Request, res: Response) => {
      const timeBlock = await TimeBlockCollection.updateOneMet(req.params.timeBlockId, req.session.userId, req.body.input);
      res.status(200).json({
        message: 'Your meeting status was updated successfully.',
        timeBlock: util.constructTimeBlockResponse(timeBlock),
      });
    }
  );

export {router as timeBlockRouter};
