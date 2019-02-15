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
      res.json({
        message: "Error",
        errors: { password: "Passwords do not match" }
      });
    } else if (req.body.password.length !== 0 && req.body.password.length < 6) {
      res.json({
        message: "Error",
        errors: { password: "Must be at least 6 chars" }
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
          errors = err.errors;
          res.json({ message: "Error", errors });
        } else {
          req.session.userId = user._id;
          req.session.userName = user.firstName;
          req.session.status = user.status;
          res.json({ message: "Success", user });
        }
      });
    }
  },

  loginUser: (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user === null || err) {
        res.json({
          message: "Error",
          errors: [{ login: "Invalid Credentials" }]
        });
      } else if (user.status === "banned") {
        res.json({
          message: "Error",
          errors: [{ login: "This account is locked" }]
        });
      } else if (!bcrypt.compareSync(req.body.password, user.password)) {
        if (user.pwAttempts > 4) {
          user.status = "banned";
          user.pwAttempts = 0;
          user.save(err => {});
          setTimeout(() => {
            user.status = "loggedOut";
            user.save(err => {});
          }, 360000);
          res.json({
            message: "error",
            errors: [
              {
                login:
                  "You have been banned for 1 hour due to exessive failure."
              }
            ]
          });
        } else {
          user.pwAttempts += 1;
          user.save(err => {});
          res.json({
            message: "Error",
            errors: [{ login: "Invalid Credentials" }],
            pwAttempts: user.pwAttempts
          });
        }
      } else {
        user.status = "loggedIn";
        user.pwAttempts = 0;
        user.save(err => {});
        req.session.userId = user._id;
        req.session.userName = user.firstName;
        req.session.status = user.status;
        res.json({
          message: "Sucess"
        });
      }
    });
  },
  getloggedUser: (req, res) => {
    User.findOne({ _id: req.session.userId }, (err, user) => {
      if (user == null) {
        res.json({ error: "error", err });
      } else {
        res.json({
          sucess: "sucess",
          userName: user.firstName,
          userEmail: user.email,
          userId: user._id,
          userStatus: user.status,
          userItems: user.items
        });
      }
    });
  },
  logOutUser: (req, res) => {
    User.findOne({ _id: req.body.userId }, (err, user) => {
      if (err || user == null) {
        res.json({ message: "error", error: "User could not be logged out" });
      } else {
        user.status = "loggedOut";
        user.save(err => {});
        req.session.userId = "";
        req.session.userName = "";
        req.session.status = "loggedOut";
        res.json({ message: "success" });
      }
    });
  },
  removeAllUsers: (req, res) => {
    User.remove({}, err => {
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success, users deleted" });
    });
  },
  findOneUser: (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success", user });
    });
  }
};
