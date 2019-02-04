const mongoose = require("mongoose"),
  User = mongoose.model("User"),
  Item = mongoose.model("Item");

module.exports = {
  createItem(req, res) {
    let newItem = new Item({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      owner: req.body.id
    });
    newItem.save((err, item) => {
      if (err) {
        res.json({ message: "error", error: err.errors });
      } else {
        User.findOne({ _id: req.body.id }, (err, user) => {
          if (user === null || err) {
            res.json({ message: "error", error: "Something went wrong" });
          } else {
            user.items.push(newItem);
            user.save(err => console.log(err));
            res.json({ message: "success", user, item });
          }
        });
      }
    });
  },
  getAll(req, res) {
    Item.find({}, (err, items) => {
      if (err) {
        res.json({ message: "error", err });
      } else {
        res.json({ message: "sucess", items });
      }
    });
  },
  getItem: (req, res) => {
    Item.findOne({ _id: req.body.itemId }, (err, item) => {
      if (err) {
        res.json({ message: "error", err });
      } else {
        res.json({ message: "success", item });
      }
    });
  },
  searchItems(req, res) {
    Item.find({ title: new RegExp(req.body.title, "i") }, (err, items) => {
      if (err) {
        res.json({ message: "error", err });
      } else {
        res.json({ message: "success", items });
      }
    });
  },
  editItem(req, res) {
    Item.findOne({ _id: req.body.id }, (err, item) => {
      if (err) {
        res.json({ message: "error", err });
      } else {
        item["title"] = req.body.title;
        item["description"] = req.body.description;
        item["price"] = req.body.price;
        item["location"] = req.body.location;
        item.save(err => console.log(err));
        res.json({ message: "success", item });
      }
    });
  },
  deleteItem(req, res) {
    Item.findByIdAndRemove(req.params.itemId, err => {
      if (err) {
        res.json({ message: "error", error: "something went wrong" });
      } else {
        User.findOne({ _id: req.params.userId }, (err, user) => {
          if (err) {
            res.json({ message: "error", err });
          } else {
            // do stuff
            for (let i = 0; i < user.items.length; i++) {
              console.log(user.items[i]._id, req.params.itemId);
              if (user.items[i]._id == req.params.itemId) {
                console.log("found it! ", user.items[i]);
                user.items.splice(i, 1);
              } else {
                console.log("Item not found ");
              }
            }
            user.save(err => {
              console.log(err);
            });
            res.json({ message: "success, item has been deleted", user });
          }
        });
      }
    });
  }
};
