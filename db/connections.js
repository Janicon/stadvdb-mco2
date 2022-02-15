const mysql = require('mysql');
const fs = require('fs');
const util = require('util');

// https://docs.microsoft.com/en-us/azure/mysql/connect-nodejs
var config0 =
{
    host: 'jan-testdb.mysql.database.azure.com',
    user: 'Janicon',
    password: 'Tester123',
    database: 'test',
    port: 3306,
    ssl: {ca: fs.readFileSync("E:/DigiCertGlobalRootCA.crt.pem")}
};

var config1 =
{
    host: 'mco2db.mysql.database.azure.com',
    user: 'dbadmin',
    password: 'MCO2node1',
    database: 'mco2node1',
    port: 3306,
    ssl: {ca: fs.readFileSync("E:/DigiCertGlobalRootCA.crt.pem")}
};

var config2 =
{
    host: 'mco2robertb.mysql.database.azure.com',
    user: 'RobertB',
    password: 'MCO2Node2',
    database: 'mco2node2',
    port: 3306,
    ssl: {ca: fs.readFileSync("E:/DigiCertGlobalRootCA.crt.pem")}
};

var config3 =
{
    host: 'mco2-server.mysql.database.azure.com',
    user: 'admin_user',
    password: 'MCO2Node3',
    database: 'mco2node3',
    port: 3306,
    ssl: {ca: fs.readFileSync("E:/DigiCertGlobalRootCA.crt.pem")}
};

var conn0 = new mysql.createConnection(config0);
var conn1 = new mysql.createConnection(config1);
var conn2 = new mysql.createConnection(config2);
var conn3 = new mysql.createConnection(config3);

connections = {
    test: conn0,
    node1: conn1,
    node2: conn2,
    node3: conn3,
    testp: util.promisify(conn0.query).bind(conn0),
    node1p: util.promisify(conn1.query).bind(conn1),
    node2p: util.promisify(conn2.query).bind(conn2),
    node3p: util.promisify(conn3.query).bind(conn3)
}

module.exports = connections;