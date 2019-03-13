const express = require("express");

const ExpressError = require("./helpers/expressError");

// const morgan = require("morgan");

const app = express();

app.use(express.json());

// add logging system
// app.use(morgan("tiny"));