const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "../../client/dist/client"));

require("./models/User");
require("./models/Item");
require("./config/routes")(app);

app.listen(port, () => console.log(`listening on port ${port}`));
