// All the rules for validation
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
  const errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Validate email
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // Validate password
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
