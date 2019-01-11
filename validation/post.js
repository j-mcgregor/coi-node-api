// All the rules for validation
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  const errors = {};

  data.body = !isEmpty(data.body) ? data.body : '';

  if (!Validator.isLength(data.body, { min: 10, max: 300 })) {
    errors.body = 'Post must be between 10 and 300 characters';
  }

  // Validate body empty
  if (Validator.isEmpty(data.body)) {
    errors.body = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
