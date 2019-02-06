const validate = require("mongoose-validator");
const mongoose = require("mongoose");
require("../config/mongoose");

const priceValidator = [
  validate({
    validator: price => {
      return price < 1 ? false : true;
    },
    message: "Price must be $1 or more"
  })
];

const descValidator = [
  validate({
    validator: "isLength",
    arguments: [0, 255],
    message: "Description must be less than 200 characters"
  })
];

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Items must have a title"] },
    description: {
      type: String,
      required: [true, "Please leave a description"],
      validate: descValidator
    },
    price: {
      type: Number,
      required: [true, "Must list a price"],
      validate: priceValidator
    },
    location: {
      type: String,
      required: [true, "Must provide location. City, State"]
    },
    image: {
      type: String,
      required: [true, "Must provide an image URL"]
    },
    owner: {
      type: String
    },
    buyer: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
