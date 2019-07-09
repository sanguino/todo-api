import Joi from '@hapi/joi';
import debugLib from 'debug';

const debug = debugLib('todo-api:validators');

const validate = (params, schema, msg) => {
  const result = Joi.validate(params, schema);
  if (result.error === null) {
    debug('validation ok', params);
    return Promise.resolve();
  }
  debug('validation err', msg);
  return Promise.reject(msg);
};

export const checkId = id => {
  const schema = Joi.object()
    .required()
    .keys({
      id: Joi.string().required(),
    });

  debug('checkId', id);
  return validate({ id }, schema, 'validation handler: bad data');
};

export const checkIdAndCompleted = (id, params) => {
  const schema = Joi.object()
    .required()
    .keys({
      id: Joi.string().required(),
      completed: Joi.boolean().required(),
    });

  debug('checkIdAndCompleted', id, params);
  return validate({ id, ...params }, schema, 'validation handler: bad data');
};

export const checkIdAndText = params => {
  const schema = Joi.object()
    .required()
    .keys({
      id: Joi.string().required(),
      text: Joi.string().required(),
    });

  debug('checkIdAndText', params);
  debug('checkIdAndText', params.id);
  debug('checkIdAndText', params.text);
  return validate(params, schema, 'validation handler: bad data');
};
