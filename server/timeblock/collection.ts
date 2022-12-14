import type {HydratedDocument, Types} from 'mongoose';
import type {TimeBlock} from './model';
import TimeBlockModel from './model';

/**
 * This files contains a class that has the functionality to explore time blocks
 * stored in MongoDB, including adding, finding, updating, and deleting time blocks.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<TimeBlock> is the output of the TimeBlockModel() constructor,
 * and contains all the information in TimeBlock. https://mongoosejs.com/docs/typescript.html
 */
class TimeBlockCollection {
  /**
   * Add a time block to the collection
   *
   * @param {string} ownerId - The id of the owner of the time block
   * @param {Date} start - The start time of the time block
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly created tim eblock
   */
  static async addOne(ownerId: Types.ObjectId | string, start: Date): Promise<HydratedDocument<TimeBlock>> {
    const timeBlock = new TimeBlockModel({
      owner: ownerId,
      start: start
    });
    await timeBlock.save(); // Saves time block to MongoDB
    return timeBlock.populate('owner');
  }

  /**
   * Find a time block by timeBlockId
   *
   * @param {string} timeBlockId - The id of the time block to find
   * @return {Promise<HydratedDocument<TimeBlock>> | Promise<null> } - The time block with the given timeBlockId, if any
   */
  static async findOne(timeBlockId: Types.ObjectId | string): Promise<HydratedDocument<TimeBlock>> {
    return TimeBlockModel.findOne({_id: timeBlockId}).populate('owner requester');
  }

  /**
   * Get all the time blocks in the database with a given user as owner
   * in order of most to least recent start time, uncanceled
   *
   * @param {string} ownerId - The id of the owner
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
  static async findAllByOwner(ownerId: Types.ObjectId | string): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    return TimeBlockModel.find({owner: ownerId, status: {$ne: 'CANCELED'}}).sort({start: -1}).populate('owner requester');
  }

  /**
   * Get all the time blocks in the database with a given user as owner or requester
   * in order of most to least recent start time
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given user
   */
  static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}]}).sort({start: -1}).populate('owner requester');
  }

  /**
   * Get all the time blocks in the database with a given user as owner or requester
   * and a given start time that are uncanceled
   *
   * @param {string} userId - The id of the user
   * @param {Date} start - The start time
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given user and start time
   */
  static async findAllUncanceledByUserAndStart(userId: Types.ObjectId | string, start: Date): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const startTime = new Date(start);
    return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId, accepted: true}], start: startTime, status: {$ne: 'CANCELED'}}).sort({start: -1}).populate('owner requester');
  }

  /**
   * Get all the time blocks in the database with a given user as owner or requester that's passed
   * in order of most to least recent start time, not including canceled ones
   *
   * @param {string} userId - The id of the user
   * @param {boolean} checkMet - Whether we want to get the ones with no response status
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
   static async findAllByUserOccurred(userId: Types.ObjectId | string, checkMet: boolean): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const now = new Date();
    if (checkMet) {
      return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}],start: {$lte: now}, accepted: true, status: 'NO_RESPONSE'}).sort({start: -1}).populate('owner requester');
    } else {
      return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}],start: {$lte: now}, accepted: true, status: {$ne: 'CANCELED'}}).sort({start: -1}).populate('owner requester');
    }
  }

  /**
   * Get all the time blocks in the database with a given user as owner or requester that's passed
   * in order of most to least recent start time, including cancellations but at the bottom
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
   static async findAllByUserAccepted(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const now = new Date();
    const uncanceled = await TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}], start: {$gte: now}, accepted: true, status: 'NO_RESPONSE'}).sort({start: 1}).populate('owner requester');
    const canceled = await TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}], start: {$gte: now}, accepted: true, status: 'CANCELED'}).sort({start: 1}).populate('owner requester');
    return uncanceled.concat(canceled);
  }

  /**
   * Get all the time blocks in the database with a given owner that are unclaimed in the future
   * in order of most to least recent start time
   *
   * @param {string} ownerId - The id of the owner
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
  static async findAllByOwnerUnclaimed(ownerId: Types.ObjectId | string): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return TimeBlockModel.find({owner: ownerId, requester: null, start: {$gte: now}}).sort({start: -1}).sort({start: 1}).populate('owner requester');
  }

  /**
   * Get all the time blocks in the database that are unanswered requests that haven't happened yet
   * in order of closest to farthest start time
   *
   * @param {string} userId - The id of the user
   * @param {boolean} getSent - Whether we want sent meeting requests or received meeting requests
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the request time blocks
   */
   static async findAllRequests(userId: Types.ObjectId | string, getSent: boolean): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const now = new Date();
    if (getSent) {
      return TimeBlockModel.find({requester: userId, accepted: false, start: {$gte: now}}).sort({start: 1}).populate('owner requester');
    } else {
      return TimeBlockModel.find({owner: userId, accepted: false, requester: {$ne: null}, start: {$gte: now}}).sort({start: 1}).populate('owner requester');
    }
  }

  /**
   * Get the number of total meetings that the user has had not including cancellations
   * 
   * @param {string} userId - The id of the user
   * @param {Date} startAfter - The date after which to count timeblocks
   * @return {Promise<Number>} - The number of meetings a user owns and has accepted 
   */
   static async findTotalMeetingsByUser(userId: Types.ObjectId | string, startAfter: Date = null): Promise<Number> {
    const now = new Date();
    if (startAfter) {
      return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}], accepted: true, status: {$ne: 'CANCELED'}, start: {$gte: startAfter, $lte: now}}).count();
    } else {
      return await TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}], accepted: true, status: {$ne: 'CANCELED'}, start: {$lte: now}}).count();
    }
  }

  /**
   * Get the number of total meetings that the user has attended (or at least 
   * has not been reported as not attending)
   * 
   * @param {string} userId - The id of the user
   * @return {Promise<Number>} - The number of meetings a user owns, has accepted, and has attended 
   */
  static async findTotalMetByUser(userId: Types.ObjectId | string): Promise<Number> {
    return await TimeBlockModel.find({
      $or: [
        {owner: userId, status: {$in: ['OWNER_MET', 'MET', 'NO_RESPONSE']}},
        {requester: userId, status: {$in: ['REQUESTER_MET', 'MET', 'NO_RESPONSE']}},
      ],
      accepted: true,
      start: {$lte: new Date()},
    }).count();
  }

  /**
   * Find if user has access to request other user's blocks
   * 
   * @param {string} userId - The id of the user
   * @return {Promise<Boolean>} - True if the user has access
   */
  static async findAccessStatus(userId: Types.ObjectId | string): Promise<Boolean> {
    const userBlocks = await TimeBlockModel.find({owner: userId, status: {$ne: 'CANCELED'}}).sort({start: -1}).populate('owner requester');
    const today = new Date();
    const rangeEnd = new Date();
    rangeEnd.setHours(0, 0, 0, 0);
    rangeEnd.setDate(rangeEnd.getDate() - rangeEnd.getDay() + 7 * 4); // What shows on calendar

    for (const block of userBlocks) {
      const blockDate = new Date(block.start);
      if (blockDate > today && blockDate < rangeEnd) {
        return true;
      }
    }
    return false;
  }

  /**
   * Find if user has availabilities available on their profile
   * 
   * @param {string} userId - The id of the user
   * @return {Promise<Boolean>} - True if the user has availabilities on their profile
   */
  static async findAvailabilityStatus(userId: Types.ObjectId | string): Promise<Boolean> {
    const userBlocks = await TimeBlockModel.find({owner: userId, status: {$ne: 'CANCELED'}}).sort({start: -1}).populate('owner requester');
    const today = new Date();
    const rangeEnd = new Date();
    rangeEnd.setHours(0, 0, 0, 0);
    rangeEnd.setDate(rangeEnd.getDate() - rangeEnd.getDay() + 7 * 4); // What shows on calendar

    for (const block of userBlocks) {
      const blockDate = new Date(block.start);
      if (blockDate > today && blockDate < rangeEnd && block.requester == null) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Get the number of total months that the user has been active (e.g. putting time blocks in)
   * 
   * @param {string} userId - The id of the user
   * @return {Promise<Number>} - The number of months since a user put in their first availability
   */
  static async findTotalMonthsByUser(userId: Types.ObjectId | string): Promise<Number> {
    // month calculation taken from https://stackoverflow.com/a/2536445 
    const firstTimeBlock = await TimeBlockModel.findOne({owner: userId}).sort({start: 1});
    if (!firstTimeBlock) {
      return 1;
    }
    const firstStart = firstTimeBlock.start;
    const today = new Date();
    var months = (today.getFullYear() - firstStart.getFullYear()) * 12;
    months -= firstStart.getMonth();
    months += today.getMonth();
    return months <= 0 ? 1 : months+1;
  }

  /**
   * Get the number of total unique users that the given owner has met with
   *
   * @param {string} userId - The id of the owner
   * @return {Promise<Number>} - The number of unique users that a given owner has met with
   */
   static async findTotalUniqueMetByUser(userId: Types.ObjectId | string): Promise<Number> {
    const now = new Date();
    const requesters = await TimeBlockModel.find({owner: userId, accepted: true, start: {$lte: now}, status: {$nin: ['CANCELED', 'REQUESTER_MET']}}).distinct('requester');
    let users = new Set(requesters);
    const owners = await TimeBlockModel.find({requester: userId, accepted: true, start: {$lte: now}, status: {$nin: ['CANCELED', 'OWNER_MET']}}).distinct('owner');
    const newUsers = new Set(owners);
    users = new Set([...users, ...newUsers]);
    return users.size;
  }

  /**
   * Update a time block with the new requester
   *
   * @param {string} timeBlockId - The id of the time block to be updated
   * @param {string} requesterId - The userId of the requester
   * @param {string} message - The message the requester wants to send with the request
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly updated time block
   */
  static async updateOneRequest(timeBlockId: Types.ObjectId | string, requesterId: Types.ObjectId | string = null, message: string = ''): Promise<HydratedDocument<TimeBlock>> {
    const timeBlock = await TimeBlockModel.findOne({_id: timeBlockId});
    timeBlock.requester = requesterId ? requesterId as Types.ObjectId : null;
    timeBlock.message = message;
    await timeBlock.save();
    return timeBlock.populate('owner requester');
  }

  /**
   * Update a time block with an accept
   *
   * @param {string} timeBlockId - The id of the time block to be updated
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly updated time block
   */
  static async updateOneAccepted(timeBlockId: Types.ObjectId | string): Promise<HydratedDocument<TimeBlock>> {
    const timeBlock = await TimeBlockModel.findOne({_id: timeBlockId});
    timeBlock.accepted = true;
    await timeBlock.save();
    return timeBlock.populate('owner requester');
  }

  /**
   * Update a time block with met
   *
   * @param {string} timeBlockId - The id of the time block to be updated
   * @param {string} responderId - The id of the responder
   * @param {boolean} met - Whether the meeting should be marked as met or not
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly updated time block
   */
  static async updateOneMet(timeBlockId: Types.ObjectId | string, responderId: Types.ObjectId | string, met: boolean): Promise<HydratedDocument<TimeBlock>> {
    const timeBlock = await TimeBlockModel.findOne({_id: timeBlockId});
    if (met) {
      timeBlock.status = 'MET';
    }
    else if (responderId == timeBlock.owner._id) {
      timeBlock.status = 'OWNER_MET';
    }
    else if (responderId == timeBlock.requester._id) {
      timeBlock.status = 'REQUESTER_MET';
    }
    await timeBlock.save();
    return timeBlock.populate('owner requester');
  }

  /**
   * Update a time block with cancel
   *
   * @param {string} timeBlockId - The id of the time block to be updated
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly updated time block
   */
   static async updateOneCancel(timeBlockId: Types.ObjectId | string): Promise<HydratedDocument<TimeBlock>> {
    const timeBlock = await TimeBlockModel.findOne({_id: timeBlockId});
    timeBlock.status = 'CANCELED';
    await timeBlock.save();
    return timeBlock.populate('owner requester');
  }

  /**
   * Delete a time block with given timeBlockId.
   *
   * @param {string} timeBlockId - The timeBlockId of time block to delete
   * @return {Promise<Boolean>} - true if the time block has been deleted, false otherwise
   */
  static async deleteOne(timeBlockId: Types.ObjectId | string): Promise<boolean> {
    const timeBlock = await TimeBlockModel.deleteOne({_id: timeBlockId});
    return timeBlock !== null;
  }
}

export default TimeBlockCollection;
