require('dotenv').config()

const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const app = express();
// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./routes/images'));

// Start the server
const port = app.get("port") || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));