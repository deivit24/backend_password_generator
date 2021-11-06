const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUserPassword = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    passwordId: Joi.string().custom(objectId),
  }),
};

const deleteUserPassword = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    passwordId: Joi.string().custom(objectId),
  }),
};
const updateUserPassword = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    passwordId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      website: Joi.string(),
      text: Joi.string(),
    })
    .min(1),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string().valid('admin', 'user'),
      passwords: Joi.array().items(
        Joi.object({
          website: Joi.string(),
          text: Joi.string(),
        })
      ),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserPassword,
  updateUserPassword,
  deleteUserPassword,
};
