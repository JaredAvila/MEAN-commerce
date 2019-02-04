const validate = require("mongoose-validator");
const mongoose = require("mongoose");
require("../config/mongoose");

const nameValidator = [
  validate({
    validator: "isLength",
    arguments: [2, 255],
    message: "Name should be at least 2 characters long"
  }),
  validate({
    validator: "matches",
    arguments: /^[a-zA-Z\-]+$/i,
    message: "Please only use alphanumeric characters"
  })
];

const emailValidator = [
  validate({
    validator: email => {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    message: "Must be a valid email address"
  })
];

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name cannot be blank"],
      validate: nameValidator
    },
    lastName: {
      type: String,
      required: [true, "Last name cannot be blank"],
      validate: nameValidator
    },
    email: {
      type: String,
      required: [true, "Email cannot be blank"],
      validate: emailValidator
    },
    password: {
      type: String,
      required: [true, "Password cannot be blank"],
      bcrypt: true
    },
    items: {
      type: Array
    },
    pwAttempts: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: "loggedIn"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
