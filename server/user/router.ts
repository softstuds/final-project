import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the signed in user
 * TODO: may need better route and documentation
 * (so students don't accidentally delete this when copying over)
 *
 * @name GET /api/users/session
 *
 * @return - currently logged in user, or null if not logged in
 */
router.get(
  '/session',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    res.status(200).json({
      message: 'Your session info was found successfully.',
      user: user ? util.constructUserResponse(user) : null
    });
  }
);

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If email or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidEmail,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByEmailAndPassword(
      req.body.email, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Get a user
 *
 * @name GET /api/users/:userId
 *
 * @return - specified user
 */
router.get(
  '/:userId',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.params.userId);
    res.status(200).json({
      message: `Found user ${user.firstName}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Get a user by email
 *
 * @name GET /api/users/:email
 *
 * @return - specified user
 */
 router.get(
  '/email/:email',
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByEmail(req.params.email);
    res.status(200).json({
      message: `Found user ${user.firstName}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Get all users
 *
 * @name GET /api/users
 *
 * @return - all users
 */
router.get(
  '/',
  [],
  async (req: Request, res: Response) => {
    const users = await UserCollection.findAll();
    const response = users.map(util.constructUserResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} email - email of user
 * @param {string} password - user's password
 * @param {string} name - user's name
 * @param {number} graduationYear - user's graduation year
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If email is already taken
 * @throws {400} - If password or email is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidEmail,
    userValidator.isEmailNotAlreadyInUse,
    userValidator.isValidName,
    userValidator.isValidPassword,
    userValidator.isValidGraduationYear
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.email, req.body.name, req.body.password, req.body.graduationYear);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.firstName} ${user.lastName}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PATCH /api/users/email
 *
 * @param {string} email - The user's new email
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If email already taken
 * @throws {400} - If email is not of the correct format
 */
router.patch(
  '/email',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidEmail,
    userValidator.isEmailNotAlreadyInUse
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PATCH /api/users/password
 *
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {400} - If password is not of the correct format
 */
router.patch(
  '/password',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's graduation year.
 *
 * @name PATCH /api/users/gradYear
 *
 * @param {string} gradYear - The user's new gradYear
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 */
router.patch(
  '/info',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidGraduationYear
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's last active time
 *
 * @name PATCH /api/users/lastActive
 *
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 */
router.patch(
  '/lastActive',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateLastActive(userId);
    res.status(200).json({
      message: 'Last active time updated.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

export {router as userRouter};
