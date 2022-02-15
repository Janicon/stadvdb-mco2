const express = require('express');
const mainController = require('../controllers/mainController.js');
const movieController = require('../controllers/movieController.js');

const app = express();

app.get('/favicon.ico', mainController.getFavicon);
app.get('/', mainController.getIndex);
app.get('/movie/:id', movieController.getMovie);


module.exports = app;