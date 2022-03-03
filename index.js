require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.sendStatus(200);
});

// Assignment 1
app.get("/healthz", (req, res) => {
    res.sendStatus(200);
});


module.exports = app;