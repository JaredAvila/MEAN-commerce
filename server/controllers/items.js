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
      image: req.body.image,
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
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success", items });
    });
  },
  getItem: (req, res) => {
    Item.findOne({ _id: req.body.itemId }, (err, item) => {
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success", item });
    });
  },
  getRandomItem: (req, res) => {
    let randomItem = {};
    //Creates an uppercase, single charater string from a randomly generated unicode value as the 'title' for .findOne
    Item.findOne(
      {
        title: new RegExp(
          String.fromCharCode(Math.floor(Math.random() * (90 - 65)) + 65),
          "i"
        )
      },
      (err, item) => {
        if (err) {
          res.json({ message: "error", err });
        } else {
          randomItem = item;
          if (randomItem === null) {
            res.json({ message: "error" });
          } else {
            res.json({ message: "success", item: randomItem });
          }
        }
      }
    );
  },
  searchItems(req, res) {
    Item.find({ title: new RegExp(req.body.title, "i") }, (err, items) => {
      err
        ? res.json({ message: "error", err })
        : res.json({ message: "success", items });
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
            for (let i = 0; i < user.items.length; i++) {
              if (user.items[i]._id == req.params.itemId) {
                user.items.splice(i, 1);
              } else {
                res.json({ message: "Item not found " });
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
