const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const PostAuthenticationPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const PutOrDeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const validatePostAuthenticationPayload = (payload) => {
  const validationResult = PostAuthenticationPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

const validatePutOrDeleteAuthenticationPayload = (payload) => {
  const validationResult = PutOrDeleteAuthenticationPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = {
  validatePostAuthenticationPayload,
  validatePutOrDeleteAuthenticationPayload,
};