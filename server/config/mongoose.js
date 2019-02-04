const mongoose = require("mongoose");
module.exports = mongoose.connect(
  "mongodb://localhost/meanEcommerceBeltPratice",
  {
    useNewUrlParser: true
  }
);
