/* eslint-disable no-console */
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (updateBody.passwords) {
    const password = updateBody.passwords;
    user.passwords.push(password[0]);
    await user.save();
  } else {
    Object.assign(user, updateBody);
    await user.save();
  }

  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Get user password by id
 * @param {ObjectId} id
 * @param {ObjectId} passwordId
 * @returns {Promise<User>}
 */
const getUserPassword = async (id, passwordId) => {
  const user = await User.findById(id);
  const password = user.passwords.find((p) => p.id === passwordId);

  return password;
};

/**
 * Get user password by id
 * @param {ObjectId} id
 * @param {ObjectId} passwordId
 * @param {Object} updatePassword
 * @returns {Promise<User>}
 */
const updateUserPassword = async (id, passwordId, updatePassword) => {
  const user = await User.findById(id);
  const password = user.passwords.find((p) => p.id === passwordId);
  Object.assign(password, updatePassword);
  await user.save();

  return user;
};

/**
 * delete user password by id
 * @param {ObjectId} id
 * @param {ObjectId} passwordId
 */
const deleteUserPassword = async (id, passwordId) => {
  const user = await User.findById(id);
  user.passwords.pull({ _id: passwordId }); // removed
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserPassword,
  updateUserPassword,
  deleteUserPassword,
};
