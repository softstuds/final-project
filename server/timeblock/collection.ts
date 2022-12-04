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
   * @param {string} start - The start time of the time block
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly created tim eblock
   */
  static async addOne(ownerId: Types.ObjectId | string, start: string): Promise<HydratedDocument<TimeBlock>> {
    const time = new Date(start);
    const timeBlock = new TimeBlockModel({
      owner: ownerId,
      start: time
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
   * Get all the time blocks in the database with a given user as owner or requester
   * in order of most to least recent start time
   *
   * @param {string} ownerId - The id of the owner
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
  static async findAllByOwner(ownerId: Types.ObjectId | string): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    return TimeBlockModel.find({owner: ownerId}).sort({start: -1}).populate('owner requester');
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
   * Get all the time blocks in the database with a given user as owner or requester that's passed
   * in order of most to least recent start time
   *
   * @param {string} userId - The id of the user
   * @param {boolean} getUnmarked - Whether we want only unmarked past meetings or all
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
   static async findAllByUserOccurred(userId: Types.ObjectId | string, getUnmarked: boolean): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const now = new Date();
    if (getUnmarked) {
      return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}],start: {$lte: now}, accepted: true, met: null}).sort({start: -1}).populate('owner requester');
    } else {
      return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}],start: {$lte: now}, accepted: true}).sort({start: -1}).populate('owner requester');
    }
  }

  /**
   * Get all the time blocks in the database with a given user as owner or requester that's passed
   * in order of most to least recent start time
   *
   * @param {string} userId - The id of the user
   * @param {boolean} userOwner - Whether we want time blocks that user owns or all
   * @return {Promise<HydratedDocument<TimeBlock>[]>} - An array of all of the time blocks for a given owner
   */
   static async findAllByUserAccepted(userId: Types.ObjectId | string, userOwner: boolean): Promise<Array<HydratedDocument<TimeBlock>>> {
    // Retrieves time blocks and sorts them from latest to earliest time
    const now = new Date();
    if (userOwner) {
      return TimeBlockModel.find({owner: userId, start: {$gte: now}, accepted: true, met: null}).sort({start: -1}).populate('owner requester');
    } else {
      return TimeBlockModel.find({$or: [{owner: userId}, {requester: userId}],start: {$gte: now}, accepted: true}).sort({start: -1}).populate('owner requester');
    }
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
   * Get the number of total meetings that the user has accepted
   * 
   * @param {string} userId - The id of the user
   * @param {Date} startAfter - The date after which to count timeblocks
   * @return {Promise<Number>} - The number of meetings a user owns and has accepted 
   */
   static async findTotalAcceptedByOwner(userId: Types.ObjectId | string, startAfter: Date = null): Promise<Number> {
    if (startAfter) {
      return TimeBlockModel.find({owner: userId, accepted: true, start: {$gte: startAfter}}).count();
    } else {
      return TimeBlockModel.find({owner: userId, accepted: true}).count();
    }
  }

  /**
   * Get the number of total meetings that the user has attended (or at least 
   * has not been reported as not attending)
   * 
   * @param {string} userId - The id of the user
   * @return {Promise<Number>} - The number of meetings a user owns, has accepted, and has attended 
   */
  static async findTotalMetByOwner(userId: Types.ObjectId | string): Promise<Number> {
    return TimeBlockModel.find({owner: userId, accepted: true, met: {$ne: false}}).count();
  }

  /**
   * Get the number of total months that the user has been active (e.g. putting time blocks in)
   * 
   * @param {string} userId - The id of the user
   * @return {Promise<Number>} - The number of months since a user put in their first availability
   */
  static async findTotalMonthsByOwner(userId: Types.ObjectId | string): Promise<Number> {
    // month calculation taken from https://stackoverflow.com/a/2536445 
    const firstTimeBlock = await TimeBlockModel.findOne({owner: userId}).sort({start: 1});
    if (!firstTimeBlock) {
      return 0;
    }
    const firstStart = firstTimeBlock.start;
    const today = new Date();
    var months = (today.getFullYear() - firstStart.getFullYear()) * 12;
    months -= firstStart.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
  }

  /**
   * Get the number of total unique users that the given owner has met with
   *
   * @param {string} ownerId - The id of the owner
   * @return {Promise<Number>} - The number of unique users that a given owner has met with
   */
   static async findTotalUniqueMetByOwner(ownerId: Types.ObjectId | string): Promise<Number> {
    return TimeBlockModel.find({owner: ownerId, accepted: true, met: {$ne: false}}).distinct('requester').count();
  }

  /**
   * Update a time block with the new requester
   *
   * @param {string} timeBlockId - The id of the time block to be updated
   * @param {string} requesterId - The userId of the requester
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly updated time block
   */
  static async updateOneRequest(timeBlockId: Types.ObjectId | string, requesterId: Types.ObjectId | string = null): Promise<HydratedDocument<TimeBlock>> {
    const timeBlock = await TimeBlockModel.findOne({_id: timeBlockId});
    timeBlock.requester = requesterId ? requesterId as Types.ObjectId : null;
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
   * @param {boolean} met - Whether the meeting should be marked as met or not
   * @return {Promise<HydratedDocument<TimeBlock>>} - The newly updated time block
   */
     static async updateOneMet(timeBlockId: Types.ObjectId | string, met: boolean): Promise<HydratedDocument<TimeBlock>> {
        const timeBlock = await TimeBlockModel.findOne({_id: timeBlockId});
        timeBlock.met = met;
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
