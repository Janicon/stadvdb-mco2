const routes = require('./routes/routes.js');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const connections = require('./db/connections.js');
const db = require('./db/db.js');
//const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs');

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use('/', routes);

db.connect(connections.node1, 'Node 1');
db.connect(connections.node2, 'Node 2');
db.connect(connections.node3, 'Node 3');

app.listen(port, hostname, function() {
    console.log('Server is running at:');
    console.log('http://' + hostname + ':' + port);
});