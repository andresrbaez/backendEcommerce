const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

dotenv.config({ path: './config.env' });

// Utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util');
// const { app } = require('../app');


const protectSession = catchAsync(async (req, res, next) => {
    // 1. Get token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // 2. Extract token
      token = req.headers.authorization.split(' ')[1]; // -> [Bearer, token]
    }
    // 2.1. Check if the token was sent or not
    if (!token) {
      return next(new AppError('The token was invalid', 403))
    }

    // 3. Verify the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Verify the token's owner
    const user = await User.findOne({
      where: { id: decoded.id, status: 'active' },
    });

    if (!user) {
      return next(new AppError('The owner of the session is no longer active', 403))
    }
    // 5. Grant access
    req.sessionUser = user;
    next();
});

// Create middleware to protect the users accounts
const protectUsersAccount = async (req, res, next) => {
  // Check the sessionUser to compare to the one that wants to be updates/deleted
  const { sessionUser, user } = req;
  // const { id } = req.params;
  // If the users (ids) don't match send an error, otherwise continue
  if (sessionUser.id !== user.id) {
    return next(new AppError('You are not the owner of this account', 403))
  }

  // If the ids match, grant access
  next();
};

// Create middleware that only grants access to admin users
const protectAdmin = (req, res, next) => {
  const {sessionUser} = req;
  if (sessionUser.role !== 'admin') {
    return next(new AppError('You do not have the access level for this data', 403))
  }

  next();
}

module.exports = {
  protectSession,
  protectUsersAccount,
  protectAdmin
};
