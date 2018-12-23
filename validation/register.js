// All the rules for validation
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.organisation = !isEmpty(data.organisation) ? data.organisation : "";
  data.chapter = !isEmpty(data.chapter) ? data.chapter : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // ============== VALIDATE USERNAME =================
  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "Username must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  // ============== VALIDATE FIRST NAME =================
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "First name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First name field is required";
  }

  // ============== VALIDATE LAST NAME =================
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Last name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name field is required";
  }

  // ============== VALIDATE ORGANISATION =================
  if (!Validator.isLength(data.organisation, { min: 2, max: 40 })) {
    errors.organisation = "Oranisation must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.organisation)) {
    errors.organisation = "Oranisation field is required";
  }

  // ============== VALIDATE CHAPTER_ID =================
  if (Validator.isEmpty(data.chapter)) {
    errors.chapter = "Chapter is required";
  }

  // ============== VALIDATE EMAIL =================
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // ============== VALIDATE PASSWORD =================
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password should be between 6 and 30 characters";
  }

  // ============== VALIDATE PASSWORD2 =================
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Password2 field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
