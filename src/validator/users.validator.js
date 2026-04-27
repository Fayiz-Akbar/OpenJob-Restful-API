const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const UserPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').required()
});

const validateUserPayload = (payload) => {
  const validationResult = UserPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = { validateUserPayload };