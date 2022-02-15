const { query } = require("express");
const res = require("express/lib/response");

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
    
    testTransaction: function(conn) {
        console.log('Starting transaction');
        conn.query("START TRANSACTION", () => {
            console.log('Starting insert');
            conn.query('INSERT INTO users VALUE (0, "UserFirst", "UserLast")', () => {
                console.log('Rolling back');
                conn.query('COMMIT');
            });
        });
    },
    
    /*
    find: function(conn, tablename, conditions, callback) {
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
    */

    find: async(conn, tablename, conditions) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('find: Starting transaction.');
                return conn('SELECT * FROM ' + tablename + ' WHERE ' + conditions);
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
    
    /*
    findAll: function(conn, tablename, callback) {
        conn.query('SELECT * FROM ' + tablename,
            function (err, results, fields) {
                if (err) return callback(null);
                //if (err) throw err;
                else console.log('Found ' + results.length + ' row(s).');
                return callback(results);
        });
    },

    findAll: function(conn, tablename) {
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM ' + tablename, (error, result) => {
                if(error)
                    return reject(error);
                else {
                    console.log('Found ' + result.length + ' row(s).');
                    return resolve(result);
                }
            });
        });
    },
    */

    findAll: async(conn, tablename) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('findAll: Starting transaction.');
                return conn('SELECT * FROM ' + tablename);
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