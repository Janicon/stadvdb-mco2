const express = require('express');
const mainController = require('../controllers/controller.js');
const actorController = require('../controllers/actorController.js');
const directorController = require('../controllers/directorController.js');
const movieController = require('../controllers/movieController.js');

const app = express();

app.get('/favicon.ico', mainController.getFavicon);
app.get('/', mainController.getIndex);
app.get('/actor/:id', actorController.getActor);
app.get('/director/:id', directorController.getDirector);
app.get('/movie/:id', movieController.getMovie);


module.exports = app;