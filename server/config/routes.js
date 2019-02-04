const path = require("path"),
  users = require("../controllers/users"),
  items = require("../controllers/items"),
  multer = require("multer"),
  upload = multer({ dest: "uploads/" });

module.exports = app => {
  // ------------------------------------ USER ROUTES

  //GET ALL USERS
  app.get("/api/users", upload.single("productImg"), (req, res) => {
    users.getAll(req, res);
  });

  //CREATE NEW USER
  app.post("/api/user", (req, res) => {
    users.createUser(req, res);
  });

  //CREATE NEW USER
  app.post("/api/login", (req, res) => {
    users.loginUser(req, res);
  });

  //LOGOUT USER
  app.post("/api/logout", (req, res) => {
    users.logOutUser(req, res);
  });

  //DELETE ALL USERS
  app.get("/api/removeAllUsers", (req, res) => {
    users.removeAllUsers(req, res);
  });

  // ------------------------------------ ITEM ROUTES

  app.post("/api/item", (req, res) => {
    items.createItem(req, res);
  });

  app.get("/api/items", (req, res) => {
    items.getAll(req, res);
  });

  app.post("/api/searchItems", (req, res) => {
    items.searchItems(req, res);
  });

  app.post("/api/item/find", (req, res) => {
    items.getItem(req, res);
  });
  app.put("/api/item/:id", (req, res) => {
    items.editItem(req, res);
  });
  app.delete("/api/item/:itemId/:userId", (req, res) => {
    items.deleteItem(req, res);
  });

  //REDIRECT TO ANGULAR IF NO OTHER ROUTES ARE HIT
  app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("../client/dist/client/index.html"));
  });
};
