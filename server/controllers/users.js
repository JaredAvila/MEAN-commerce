const mongoose = require("mongoose"),
  User = mongoose.model("User"),
  bcrypt = require("bcryptjs");

module.exports = {
  getAll: (req, res) => {
    User.find({}, (err, users) => {
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success", users });
    });
  },

  createUser: (req, res) => {
    if (req.body.password !== req.body.password2) {
      res.json({ message: "Error", errors: ["Passwords do not match"] });
    } else if (req.body.password.length !== 0 && req.body.password.length < 6) {
      res.json({
        message: "Error",
        errors: ["Password must be at least 6 characters in length"]
      });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      });
      user.save(err => {
        let errors = [];
        if (err) {
          for (let key in err.errors) {
            errors.push(err.errors[key].message);
          }
          res.json({ message: "Error", errors });
        } else {
          res.json({ message: "Success", user });
        }
      });
    }
  },

  loginUser: (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user.status === "banned") {
        res.json({ message: "Error", error: "This account is locked" });
      } else if (user === null || err) {
        res.json({ message: "Error", error: "Invalid Credentials" });
      } else if (!bcrypt.compareSync(req.body.password, user.password)) {
        if (user.pwAttempts > 4) {
          user.status = "banned";
          user.pwAttempts = 0;
          user.save(err => console.log(err));
          setTimeout(() => {
            user.status = "loggedOut";
            user.save(err => console.log(err));
          }, 360000);
          res.json({
            message: "You have been banned for 1 hour due to exessive failure."
          });
        } else {
          user.pwAttempts += 1;
          user.save(err => console.log(err));
          res.json({
            message: "Error",
            error: "Invalid Credentials",
            pwAttempts: user.pwAttempts
          });
        }
      } else {
        user.status = "loggedIn";
        user.save(err => console.log(err));
        res.json({ message: "Sucess", user });
      }
    });
  },
  logOutUser: (req, res) => {
    User.findOne({ _id: req.body.userId }, (err, user) => {
      if (err || user == null) {
        res.json({ message: "error", error: "User could not be logged out" });
      } else {
        user.status = "loggedOut";
        user.save(err => console.log(err));
        res.json({ message: "success", user });
      }
    });
  },
  removeAllUsers: (req, res) => {
    User.remove({}, err => {
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success, users deleted" });
    });
  }
};
