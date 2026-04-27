const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const JobPayloadSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().allow('', null),
  experience_level: Joi.string().allow('', null),
  location_type: Joi.string().allow('', null),
  location_city: Joi.string().allow('', null),
  salary_min: Joi.number().allow(null),
  salary_max: Joi.number().allow(null),
  is_salary_visible: Joi.boolean().allow(null),
  status: Joi.string().required()
});

const validateJobPayload = (payload) => {
  const validationResult = JobPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = { validateJobPayload };