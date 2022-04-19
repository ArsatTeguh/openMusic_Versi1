const Joi = require('joi');

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  years: Joi.string().required(),
});

module.exports = { AlbumsPayloadSchema };