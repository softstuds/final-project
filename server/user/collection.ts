import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, name: string, password: string, graduationYear: number): Promise<HydratedDocument<User>> {
    const lastActive = new Date();
    const nameArray = name.split(' ');
    const user = new UserModel({
      email: username,
      password,
      firstName: nameArray[0],
      lastName: nameArray[nameArray.length - 1],
      graduationYear,
      lastActive
    });
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find all users
   *
   * @return {Promise<Array<HydratedDocument<User>>>} - All the users
   */
  static async findAll(): Promise<Array<HydratedDocument<User>>> {
    return await UserModel.find({}).populate('industry');
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (user) {
      await user.populate('industry');
    }
    return user;
  }

  /**
   * Find a user by email (case insensitive).
   *
   * @param {string} email - The email of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmail(email: string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({email: new RegExp(`^${email.trim()}$`, 'i')});
    if (user) {
      await user.populate('industry');
    }
    return user;
  }

  /**
   * Find a user by email (case insensitive).
   *
   * @param {string} email - The email of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmailAndPassword(email: string, password: string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({
      email: new RegExp(`^${email.trim()}$`, 'i'),
      password
    });
    if (user) {
      await user.populate('industry');
    }
    return user;
  }

  /**
   * Find users by their graduation year
   * 
   * @param {number} graduationYear - the graduation year to search for
   */
  static async findAllByGradYear(graduationYear: number): Promise<Array<HydratedDocument<User>>> {
    const users = await UserModel.find({graduationYear: graduationYear});
    return users;
  }

  /**
   * Find all users by their first name
   */
  static async findAllByFirstName(firstName: string): Promise<Array<HydratedDocument<User>>> {
    const users = await UserModel.find({firstName: {$regex : new RegExp("^" + firstName, "i")}});
    return users;
  }

  /**
   * Find all users by their last name
   */
   static async findAllByLastName(lastName: string): Promise<Array<HydratedDocument<User>>> {
    const users = await UserModel.find({lastName: {$regex : new RegExp("^" + lastName, "i")}});
    return users;
  }

  /**
   * Find all users by their full name
   */
   static async findAllByFullName(firstName: string, lastName: string): Promise<Array<HydratedDocument<User>>> {
    const users = await UserModel.find({firstName: {$regex : new RegExp("^" + firstName, "i")}, lastName: {$regex : new RegExp("^" + lastName, "i")}});
    return users;
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: {password?: string; email?: string; graduationYear?: number; bio?: string; meetingLink?: string}): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password;
    }

    if (userDetails.email) {
      user.email = userDetails.email;
    }

    if (userDetails.graduationYear) {
      user.graduationYear = userDetails.graduationYear;
    }

    if (userDetails.bio) {
      user.bio = userDetails.bio;
    }

    if (userDetails.meetingLink) {
      user.meetingLink = userDetails.meetingLink;
    }

    await user.save();
    return user.populate('industry');
  }

  /**
   * Update last active
   *
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async updateLastActive(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const lastActive = new Date();
    user.lastActive = lastActive;
    await user.save(); // Saves user to MongoDB
    return user.populate('industry');
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
