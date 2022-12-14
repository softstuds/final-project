import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {User} from './model';

// Update this if you add a property to the User type!
export type UserResponse = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  graduationYear: number;
  lastActive: string;
  bio: string;
  meetingLink: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => (new Date(date)).toLocaleDateString('en-US', { timeZone: 'America/New_York' });

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: User = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    lastActive: formatDate(user.lastActive)
  };
};

export {
  constructUserResponse
};
