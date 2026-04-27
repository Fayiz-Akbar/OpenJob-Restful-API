const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const ApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().allow('', null)
});

const ApplicationStatusSchema = Joi.object({
  status: Joi.string().required()
});

const validateApplicationPayload = (payload) => {
  const validationResult = ApplicationPayloadSchema.validate(payload);
  if (validationResult.error) throw new InvariantError(validationResult.error.message);
};

const validateApplicationStatus = (payload) => {
  const validationResult = ApplicationStatusSchema.validate(payload);
  if (validationResult.error) throw new InvariantError(validationResult.error.message);
};

module.exports = { validateApplicationPayload, validateApplicationStatus };