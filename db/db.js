const { query } = require("express");
const res = require("express/lib/response");
const async = require("hbs/lib/async");

const db = {
    connect: function(conn, servername) {
        conn.connect(
            function (err) { 
            if (err) { 
                console.log("!!! Cannot connect !!! Error:");
                throw err;
            }
            else
            {
               console.log("Connection to " + servername + " established.");
            }
        });
    },

    find: async(conn, tablename, conditions) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('find: Starting transaction.');
                return conn('SELECT * FROM ' + tablename + ' WHERE ' + conditions + ' FOR SHARE');
            })
            .then((res) => {
                result = res;
                console.log('find: Found ' + result.length + ' row(s).');
                return conn('COMMIT')
            })
            .then((res) => {
                console.log('find: Committing transaction.');
                return resolve(result);
            })
            .catch((err) => {
                console.error('find: Error - ', err);
                return reject(err);
            });
        });
    },

    findAll: async(conn, tablename) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('findAll: Starting transaction.');
                return conn('SELECT * FROM ' + tablename + ' FOR SHARE');
            })
            .then((res) => {
                result = res;
                console.log('findAll: Found ' + result.length + ' row(s).');
                return conn('COMMIT')
            })
            .then((res) => {
                console.log('findAll: Committing transaction.');
                return resolve(result);
            })
            .catch((err) => {
                console.error('findAll: Error - ', err);
                return reject(err);
            });
        });
    },

    insert: async(conn, tablename, values) => {
        var result;
        
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('insert: Start Transaction');
                return conn('INSERT INTO ' + tablename + ' VALUES (' + values + ')');
            })
            .then((res) => {
                result = res;
                console.log('insert: Inserted ' + result.affectedRows + ' row(s).');
                return conn('COMMIT');
            })
            .then((res) => {
                console.log('insert: Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('insert: Error - ', err);
                return reject(err);
            });
        });
    },

    update: async(conn, tablename, columns, values, conditions) => {
        var result;
        var query = columns[0] + '="' + values[0] + '"';
        for (var i = 1; i < columns.length; i++)
            query += ", " + columns[i] + '="' + values[i] + '"';

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('update: Start Transaction');
                return conn('UPDATE ' + tablename + ' SET ' + query + ' WHERE ' + conditions);
            })
            .then((res) => {
                result = res;
                console.log('Updated ' + result.affectedRows + ' row(s).');
                return conn('COMMIT');
            })
            .then((res) => {
                console.log('update: Committing transaction.');
                return resolve(result);
            })
            .catch((err) => {
                console.error('update: Error - ', err);
                return reject(err);
            });
        });
    },

    delete: async(conn, tablename, conditions) => {
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('delete: Start Transaction');
                return conn('DELETE FROM ' + tablename + ' WHERE ' + conditions);
            })
            .then((res) => {
                result = res;
                console.log('Deleted ' + result.affectedRows + ' row(s).');
                return conn('COMMIT');
            })
            .then((res) => {
                console.log('delete: Committing transaction.');
                return resolve(result);
            })
            .catch((err) => {
                console.error('delete: Error - ', err);
                return reject(err);
            });
        });
    }
    
    /*
    findCount: function(conn, tablename, callback) {
        conn.query('SELECT COUNT(*) AS count FROM ' + tablename,
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

    insertOne: function(conn, tablename, values, callback) {
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

    update: function(conn, tablename, columns, values, conditions, callback) {
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
    */
};

module.exports = db;