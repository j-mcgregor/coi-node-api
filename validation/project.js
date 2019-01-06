// All the rules for validation
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.intro = !isEmpty(data.intro) ? data.intro : "";
  data.impact = !isEmpty(data.impact) ? data.impact : "";
  data.businesscase = !isEmpty(data.businesscase) ? data.businesscase : "";

  // ============== VALIDATE TITLE =================
  if (!Validator.isLength(data.title, { min: 2, max: 50 })) {
    errors.title = "Intro must be between 2 and 50 characters";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Intro field is required";
  }

  // ============== VALIDATE INTRO =================
  if (!Validator.isLength(data.intro, { min: 2, max: 400 })) {
    errors.intro = "Introduction must be between 100 and 400 characters";
  }

  if (Validator.isEmpty(data.intro)) {
    errors.intro = "Introduction field is required";
  }

  // ============== VALIDATE IMPACT =================
  if (!Validator.isLength(data.impact, { min: 2, max: 400 })) {
    errors.impact = "Impact must be between 100 and 400 characters";
  }

  if (Validator.isEmpty(data.impact)) {
    errors.impact = "Impact field is required";
  }

  // ============== VALIDATE BUSINESSCASE =================
  if (!Validator.isLength(data.businesscase, { min: 2, max: 400 })) {
    errors.businesscase = "Businesscase must be between 100 and 400 characters";
  }

  if (Validator.isEmpty(data.businesscase)) {
    errors.businesscase = "Businesscase field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
