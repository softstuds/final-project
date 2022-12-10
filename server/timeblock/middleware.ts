import type {Request, Response, NextFunction} from 'express';
import TimeBlockCollection from '../timeblock/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a userId is given in req.body
 */
const isUserGiven = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.body as {userId: string};
  if (!userId) {
    res.status(400).json({error: 'Missing userId.'});
    return;
  }

  next();
};

/**
 * Checks if a userId in req.params is valid
 */
const isValidUserParam = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.userId);

  if (!user) {
    res.status(404).json({
      error: `User with ID ${req.params.userId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a userId in req.body belongs to an existing user
 */
const isValidUserBody = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.body.userId);

  if (!user) {
    res.status(404).json({
      error: `User with ID ${req.params.userId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the message of the request in req.body is valid, i.e. not more than 300 characters
 */
 const isValidMessage = (req: Request, res: Response, next: NextFunction) => {
  const {message} = req.body as {message: string};

  if (message.trim().length > 300) {
    res.status(413).json({
      error: 'Message content must be no more than 300 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if an input in req.body is valid
 */
const isValidInput = async (req: Request, res: Response, next: NextFunction) => {
  const {input} = req.body as {input: boolean};
  if (!input && input) {
    res.status(404).json({error: 'Invalid input value.'});
    return;
  }

  next();
};

/**
 * Checks if a block with a given start time in req.body already exists with the user
 */
const isBlockNonexistent = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const timeBlocks = await TimeBlockCollection.findAllByOwner(userId);
  const start = new Date(req.body.start);
  const sameStartBlock = timeBlocks.filter((block) => (block.start.getTime() == start.getTime()));

  if (sameStartBlock.length > 0) {
    res.status(409).json({
      error: `Time block with start ${req.body.start} already exists for user ID ${userId}.`
    });
    return;
  }

  next();
};

/**
 * Checks if a block with a given ID in req.params exists
 */
const isBlockExistent = async (req: Request, res: Response, next: NextFunction) => {
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (!timeBlock) {
    res.status(404).json({
      error: `Time block with ID ${req.params.timeBlockId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the user is the requester of the block with given ID in req.params
 */
 const isBlockRequester = async (req: Request, res: Response, next: NextFunction) => {
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (timeBlock.requester._id.toString() !== (req.session.userId as string)) {
    res.status(403).json({
      error: `User is not requester of time block with ID ${req.params.timeBlockId}.`
    });
    return;
  }

  next();
};

/**
 * Checks if the user is the owner of the block with given ID in req.params
 */
const isBlockOwner = async (req: Request, res: Response, next: NextFunction) => {
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (timeBlock.owner._id.toString() !== (req.session.userId as string)) {
    res.status(403).json({
      error: `User is not owner of time block with ID ${req.params.timeBlockId}.`
    });
    return;
  }

  next();
};

/**
 * Checks if the user is not the owner of the block with given ID in req.params
 */
const isBlockNotOwner = async (req: Request, res: Response, next: NextFunction) => {
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (timeBlock.owner._id === req.session.userId) {
    res.status(403).json({
      error: `User is already owner of time block with ID ${req.params.timeBlockId}.`
    });
    return;
  }

  next();
};

/**
 * Checks if the user is the owner or requester of the block with given ID in req.params
 */
const isBlockOwnerOrRequester = async (req: Request, res: Response, next: NextFunction) => {
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (timeBlock.owner._id.toString() !== req.session.userId && timeBlock.requester._id.toString() !== req.session.userId) {
    res.status(403).json({
      error: `User is not owner or requester of time block with ID ${req.params.timeBlockId}.`
    });
    return;
  }

  next();
};

/**
 * Checks if the time block given by timeBlockId in req.params is in the future
 */
const isBlockInFuture = async (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (timeBlock.start < now) {
    res.status(409).json({
      error: `Time block with ID ${req.params.timeBlockId} has already passed.`
    });
    return;
  }

  next();
};

/**
 * Checks if the time block given by timeBlockId in req.params is in the past
 */
const isBlockInPast = async (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (timeBlock.start > now) {
    res.status(409).json({
      error: `Time block with ID ${req.params.timeBlockId} has not passed yet.`
    });
    return;
  }

  next();
};

/**
 * Checks if the time block given by timeBlockId in req.params is an actual meeting
 */
const isBlockAccepted = async (req: Request, res: Response, next: NextFunction) => {
  const timeBlock = await TimeBlockCollection.findOne(req.params.timeBlockId);
  if (!timeBlock.accepted) {
    res.status(409).json({
      error: `Time block with ID ${req.params.timeBlockId} is not an accepted meeting.`
    });
    return;
  }

  next();
};

/**
 * Checks if the time given is in the next 4 weeks
 */
const isBlockInNextFour = async (req: Request, res: Response, next: NextFunction) => {
  const rangeEnd = new Date();
  rangeEnd.setHours(0, 0, 0, 0);
  rangeEnd.setDate(rangeEnd.getDate() - rangeEnd.getDay() + 28);

  const now = new Date();

  const start = new Date(req.body.start);
  if (start < now || start >= rangeEnd) {
    res.status(403).json({
      error: 'You can only enter time blocks for the next 4 weeks.'
    });
    return;
  }

  next();
};

export {
  isUserGiven,
  isValidUserParam,
  isValidUserBody,
  isValidMessage,
  isValidInput,
  isBlockNonexistent,
  isBlockExistent,
  isBlockOwner,
  isBlockNotOwner,
  isBlockRequester,
  isBlockOwnerOrRequester,
  isBlockInFuture,
  isBlockInPast,
  isBlockAccepted,
  isBlockInNextFour
};
