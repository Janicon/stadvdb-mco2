const routes = require('./routes/routes.js');
const dotenv = require('dotenv');
const express = require('express');
//const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

app.use(express.static(__dirname + '/public'));
app.use('/', routes);

app.listen(port, hostname, function() {
    console.log('Server is running at:');
    console.log('http://' + hostname + ':' + port);
});