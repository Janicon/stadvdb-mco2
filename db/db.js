const mysql = require('mysql');
const fs = require('fs');

// https://docs.microsoft.com/en-us/azure/mysql/connect-nodejs
var config =
{
    host: 'jan-testdb.mysql.database.azure.com',
    user: 'Janicon',
    password: 'Tester123',
    database: 'test',
    port: 3306,
    ssl: {ca: fs.readFileSync("E:/DigiCertGlobalRootCA.crt.pem")}
};

const conn = new mysql.createConnection(config);


const db = {
    connect: function() {
        conn.connect(
            function (err) { 
            if (err) { 
                console.log("!!! Cannot connect !!! Error:");
                throw err;
            }
            else
            {
               console.log("Connection established.");
            }
        });
    },
    
    find: function(tablename, conditions, callback) {
        conn.query('SELECT * FROM ' + tablename + ' WHERE ' + conditions,
            function (err, results, fields) {
                if (err) return callback(null);
                //if (err) throw err;
                else console.log('Found ' + results.length + ' row(s).');
                return callback(results);
            })
        conn.end(
            function (err) { 
                if (err) return callback(null);
                //if (err) throw err;
                else  console.log('Closing connection.') 
        });
    },
    
    findAll: function(tablename, callback){
        conn.query('SELECT * FROM ' + tablename,
            function (err, results, fields) {
                if (err) return callback(null);
                //if (err) throw err;
                else console.log('Found ' + results.length + ' row(s).');
                return callback(results);
            })
        conn.end(
            function (err) { 
                if (err) return callback(null);
                //if (err) throw err;
                else  console.log('Closing connection.') 
        });
    },

    insertOne: function(tablename, values, callback) {
        conn.query('INSERT INTO ' + tablename + ' VALUES (' + values + ')',
            function(err, results, fields) {
            //if (err) throw err;
            if (err) return callback(false);
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            return callback(true);
        })
        conn.end(
            function (err) { 
                //if (err) throw err;
                if (err) return callback(false);
                else console.log('Done.') 
        });
    },

    update: function(tablename, columns, values, conditions, callback) {
        var query = '';
        for (var i in columns)
            query += columns[i] + '=' + values[i];
        conn.query('UPDATE ' + tablename + ' SET ' + query + ' WHERE ' + conditions,
            function(err, results, fields) {
                if (err) return callback(false);
                else console.log('Updated ' + rsults.affectedRows + ' row(s).');
                return callback(true);
            })
        conn.end(
            function(err) {
                if (err) return callback(false);
                else console.log('Done.');
        });
    }
};

module.exports = db;