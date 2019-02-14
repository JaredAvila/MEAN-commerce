const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const app = express();
const session = require("express-session");
const port = 8000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "../../client/dist/client"));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(
  session({
    secret: "secretCodism",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

require("./models/User");
require("./models/Item");
require("./config/routes")(app);

app.listen(port, () => console.log(`listening on port ${port}`));
