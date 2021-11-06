/* eslint-disable no-console */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Passwords

const getUserPassword = catchAsync(async (req, res) => {
  const { userId, passwordId } = req.params;
  const password = await userService.getUserPassword(userId, passwordId);
  if (!password) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password not found');
  }

  res.send(password);
});

const updateUserPassword = catchAsync(async (req, res) => {
  const { userId, passwordId } = req.params;
  const user = await userService.updateUserPassword(userId, passwordId, req.body);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.send(user);
});

const deleteUserPassword = catchAsync(async (req, res) => {
  const { userId, passwordId } = req.params;
  const password = await userService.getUserPassword(userId, passwordId);
  if (!password) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password not found');
  }
  await userService.deleteUserPassword(userId, passwordId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserPassword,
  updateUserPassword,
  deleteUserPassword,
  updateUser,
  deleteUser,
};
