// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const database = require("./database/database");
//var path = require('path');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//pp.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static("public"));
app.use(
    cookieSession({
      name: "session",
      keys: [
        "b6d0e7eb-8c4b-4ae4-8460-fd3a08733dcb",
        "1fb2d767-ffbf-41a6-98dd-86ac2da9392e",
      ],
    })
  );

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
app.get("/hello", (req,res) => {

    res.send("Hello There!");
});

module.exports = app;
