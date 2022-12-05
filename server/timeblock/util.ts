import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {TimeBlock, PopulatedTimeBlock} from '../timeblock/model';

// Update this if you add a property to the TimeBlock type!
type TimeBlockResponse = {
  _id: string;
  owner: string;
  requester: string;
  start: string;
  accepted: boolean;
  met: boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
// const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');
const formatDate = (date: Date): string => date.toString();

/**
 * Transform a raw TimeBlock object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<TimeBlock>} timeBlock - A time block
 * @returns {TimeBlockResponse} - The timeBlock object formatted for the frontend
 */
const constructTimeBlockResponse = (timeBlock: HydratedDocument<TimeBlock>): TimeBlockResponse => {
  const timeBlockCopy: PopulatedTimeBlock = {
    ...timeBlock.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const owner = timeBlockCopy.owner._id.toString();
  delete timeBlockCopy.owner;
  const requester = (timeBlockCopy.requester) ? timeBlockCopy.requester._id.toString() : null;
  return {
    ...timeBlockCopy,
    _id: timeBlockCopy._id.toString(),
    owner,
    requester,
    start: formatDate(timeBlockCopy.start)
  };
};

export {
  constructTimeBlockResponse
};
