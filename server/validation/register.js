const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.businessName = !isEmpty(data.businessName) ? data.businessName : "";
  data.userType = !isEmpty(data.userType) ? data.userType : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // first name validation
  if (!Validator.isLength(data.businessName, { min: 2, max: 30 })) {
    errors.businessName = "Business Name must be between 2 to 30 characters";
  }
  if (Validator.isEmpty(data.businessName)) {
    errors.businessName = "Business Name is required";
  }

  // userType validation
  // if (Validator.isEmpty(data.userType)) {
  //   errors.userType = "User type is required";
  // }

  // firstName validation
  if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "Firstname must be between 2 to 30 characters";
  }
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Firstname is required";
  }

  // lastName validation
  if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Lastname must be between 2 to 30 characters";
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Lastname is required";
  }

  // email validation
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  // password validation
  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  // password2 validation
  // if (Validator.isEmpty(data.password2)) {
  //   errors.password2 = "Confirm password is required";
  // }
  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = "Passwords does not match";
  // }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
