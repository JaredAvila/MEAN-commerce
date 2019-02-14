const path = require("path"),
  users = require("../controllers/users"),
  items = require("../controllers/items");

module.exports = app => {
  // ------------------------------------ USER ROUTES

  //GET ALL USERS
  app.get("/api/users", (req, res) => {
    users.getAll(req, res);
  });

  //CREATE NEW USER
  app.post("/api/user", (req, res) => {
    users.createUser(req, res);
  });

  //LOGIN USER
  app.post("/api/login", (req, res) => {
    users.loginUser(req, res);
  });

  // GET LOGGED IN USER
  app.get("/api/getUser", (req, res) => {
    users.getloggedUser(req, res);
  });

  //LOGOUT USER
  app.post("/api/logout", (req, res) => {
    users.logOutUser(req, res);
  });

  //FIND ONE USER BY ID
  app.get("/api/user/:id", (req, res) => {
    users.findOneUser(req, res);
  });

  //DELETE ALL USERS
  app.get("/api/removeAllUsers", (req, res) => {
    users.removeAllUsers(req, res);
  });

  // ------------------------------------ ITEM ROUTES

  //CREATE ITEM
  app.post("/api/item", (req, res) => {
    items.createItem(req, res);
  });

  //GET ALL ITEMS
  app.get("/api/items", (req, res) => {
    items.getAll(req, res);
  });

  //SEARCH FOR ITEM/ITEMS
  app.post("/api/searchItems", (req, res) => {
    items.searchItems(req, res);
  });

  //FIND ONE ITEM
  app.post("/api/item/find", (req, res) => {
    items.getItem(req, res);
  });

  // FIND ONE RANDOM ITEM
  app.get("/api/item/random", (req, res) => {
    items.getRandomItem(req, res);
  });

  //EDIT ONE ITEM
  app.put("/api/item/:id", (req, res) => {
    items.editItem(req, res);
  });

  //DELETE ONE ITEM
  app.delete("/api/item/:itemId/:userId", (req, res) => {
    items.deleteItem(req, res);
  });

  //REDIRECT TO ANGULAR IF NO OTHER ROUTES ARE HIT
  app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("../client/dist/client/index.html"));
  });
};
