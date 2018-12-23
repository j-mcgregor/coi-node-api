// All the rules for validation
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data){
  const errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  // Validate text empty
  if (Validator.isEmpty(data.text)) {
    errors.text = 'Texarea field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
