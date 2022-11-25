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
    return UserModel.find({});
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by email (case insensitive).
   *
   * @param {string} email - The email of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmail(email: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({email: new RegExp(`^${email.trim()}$`, 'i')});
  }

  /**
   * Find a user by email (case insensitive).
   *
   * @param {string} email - The email of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given email, if any
   */
  static async findOneByEmailAndPassword(email: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      email: new RegExp(`^${email.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: {password?: string; email?: string; industry?: string}): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password;
    }

    if (userDetails.email) {
      user.email = userDetails.email;
    }

    if (userDetails.industry) {
      user.industry = userDetails.industry;
    }

    await user.save();
    return user;
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
