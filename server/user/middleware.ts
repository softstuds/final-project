import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a name in req.body is valid
 */
const isValidName = (req: Request, res: Response, next: NextFunction) => {
  const names = (req.body.name as string).split(' ');
  if (names.length < 2) {
    res.status(400).json({
      error: 'Enter first and last name.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a email in req.body is valid
 */
const isValidEmail = (req: Request, res: Response, next: NextFunction) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(req.body.email)) {
    res.status(400).json({
      error: 'Email must be example@domain (ex. hello@gmail.com).'
    });
    return;
  }

  next();
};

/**
 * Checks if a email in req.body is valid
 */
const isValidGraduationYear = (req: Request, res: Response, next: NextFunction) => {
  const gradYear = parseInt(req.body.graduationYear, 10);
  if (gradYear < 1860 && gradYear > 2026) {
    res.status(400).json({
      error: 'Invalid graduation year.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body as {email: string; password: string};

  if (!email || !password) {
    res.status(400).json({error: `Missing ${email ? 'password' : 'username'} credentials for sign in.`});
    return;
  }

  const user = await UserCollection.findOneByEmailAndPassword(
    email, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Invalid user login credentials provided.'});
  }
};

/**
 * Checks if a username in req.body is already in use
 */
const isEmailNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email !== undefined) { // If email is not being changed, skip this check
    const user = await UserCollection.findOneByEmail(req.body.email);

    // If the current session user wants to change their username to one which matches
    // the current one irrespective of the case, we should allow them to do so
    if (user) {
      res.status(409).json({
        error: 'An account with this username already exists.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.userId);
  if (!user) {
    res.status(404).json({
      error: `A user with userId ${req.params.userId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.author) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByEmail(req.query.author as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.author as string} does not exist.`
    });
    return;
  }

  next();
};

export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isEmailNotAlreadyInUse,
  isAccountExists,
  isUserExists,
  isAuthorExists,
  isValidName,
  isValidPassword,
  isValidEmail,
  isValidGraduationYear,
  isUserExists
};
