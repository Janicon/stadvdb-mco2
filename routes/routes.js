const express = require('express');
const mainController = require('../controllers/mainController.js');
const movieController = require('../controllers/movieController.js');
const testController = require('../controllers/testController.js');

const app = express();

app.get('/favicon.ico', mainController.getFavicon);
app.get('/', mainController.getIndex);
app.get('/movie/:id', movieController.getMovie);
app.post('/addMovie', movieController.addMovie);
app.post('/movie/:id/edit', movieController.editMovie);
app.get('/movie/:id/delete', movieController.deleteMovie);

app.get('/users', testController.getUsers);
app.get('/users/:id', testController.getUser);
app.get('/addUser', testController.addUser);

app.get('/empty', mainController.getError);
app.get('*', mainController.getError);

module.exports = app;