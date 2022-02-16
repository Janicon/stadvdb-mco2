const e = require("express");
const { query } = require("express");
const res = require("express/lib/response");
const async = require("hbs/lib/async");

const db = {
    connect: function(conn, servername) {
        conn.connect(
            function (err) { 
            if (err)
                console.log('<db.connect> Could not connect to [' + servername + ']');
            else
               console.log('<db.connect> Connection to [' + servername + '] established');
        });
    },

    find: async(conn, tablename, conditions) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.find> Starting transaction');
                return conn('SELECT * FROM ' + tablename + ' WHERE ' + conditions + ' FOR SHARE');
            })
            .then((res) => {
                result = res;
                console.log('<db.find> Found ' + result.length + ' row(s)');
                return conn('COMMIT')
            })
            .then((res) => {
                console.log('<db.find> Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('<db.find> Error - ', err);
                return reject(err);
            });
        });
    },

    findAll: async(conn, tablename) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.findAll> Starting transaction');
                return conn('SELECT * FROM ' + tablename + ' FOR SHARE');
            })
            .then((res) => {
                result = res;
                console.log('<db.findAll> Found ' + result.length + ' row(s)');
                return conn('COMMIT')
            })
            .then((res) => {
                console.log('<db.findAll> Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('<db.findAll> Error - ', err);
                return reject(err);
            });
        });
    },

    insert: async(conn, tablename, values) => {
        var result;
        
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.insert> Starting transaction');
                return conn('INSERT INTO ' + tablename + ' VALUES (' + values + ')');
            })
            .then((res) => {
                result = res;
                console.log('<db.insert> Inserted ' + result.affectedRows + ' row(s)');
                return conn('COMMIT');
            })
            .then((res) => {
                console.log('<db.insert> Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('<db.insert> Error - ', err);
                return reject(err);
            });
        });
    },

    insertTwoNodes: async(conn, conn2, tablename, values) => {
        var result1, result2;
        var transact1 = false, transact2 = false;
        
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            // Start transaction for Node 1
            .then((res) => {
                transact1 = true;
                console.log('<db.insert> Starting transaction 1');
                return conn('INSERT INTO ' + tablename + ' VALUES (' + values + ')');
            })
            // Attempt to insert to Node 1
            .then((res) => {
                result1 = res;
                console.log('<db.insert> Inserted ' + result1.affectedRows + ' row(s)');
                // If Node 1 was not updated, do a rollback
                if(result1.affectedRows == 0)
                    throw new Error();
                // If Node 1 was updated, commit
                else {
                    return conn('COMMIT')
                    // Commit updates to Node 1
                    .then((res) => {
                        console.log('<db.insert> Committing transaction 1');
                        return conn2('START TRANSACTION')
                    })
                    // Start transaction for Node 2
                    .then((res) => {
                        transact2 = true;
                        console.log('<db.insert> Starting transaction 2');
                        return conn2('INSERT INTO ' + tablename + ' VALUES (' + values + ')');
                    })
                    // Attempt to insert to Node 2
                    .then((res) => {
                        result2 = res;
                        console.log('<db.insert> Inserted ' + result2.affectedRows + ' row(s)');
                        // If Node 2 was not updated, do a rollback
                        if(result2.affectedRows == 0)
                            throw new Error();
                        // If Node 2 was updated, commit
                        else {
                            return conn2('COMMIT')
                            // Commit updates to Node 2
                            .then((res) => {
                                console.log('<db.insert> Committing transaction 2');
                                var result = [result1, result2];
                                return resolve(result);
                            })
                        }
                    })
                    .catch((err) => {
                        console.error('<db.insert> Error - transaction 2 wrote 0 records');
                        return conn('ROLLBACK');
                    })
                    // Rollback changes to Node 2
                    .then((res) => {
                        console.log('<db.insert> Rolling back transaction 2');
                        return reject(new Error());
                    });
                }
            })
            .catch((err) => {
                console.error('<db.insert> Error - transaction 1 wrote 0 records');
                return conn('ROLLBACK');
            })
            // Rollback changes to Node 1
            .then((res) => {
                console.log('<db.insert> Rolling back transaction 1');
                return reject(new Error());
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
                console.log('<db.update> Starting transaction');
                return conn('UPDATE ' + tablename + ' SET ' + query + ' WHERE ' + conditions);
            })
            .then((res) => {
                result = res;
                console.log('<db.update> Updated ' + result.affectedRows + ' row(s)');
                return conn('COMMIT');
            })
            .then((res) => {
                console.log('<db.update> Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('<db.update> Error - ', err);
                return reject(err);
            });
        });
    },

    updateTwoNodes: async(conn, conn2, tablename, columns, values, conditions) => {
        var result1, result2;
        var transact1 = false, transact2 = false;
        var query = columns[0] + '="' + values[0] + '"';
        for (var i = 1; i < columns.length; i++)
            query += ", " + columns[i] + '="' + values[i] + '"';

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            // Start transaction for Node 1
            .then((res) => {
                transact1 = true;
                console.log('<db.update> Starting transaction 1');
                return conn('UPDATE ' + tablename + ' SET ' + query + ' WHERE ' + conditions);
            })
            // Attempt to update Node 1
            .then((res) => {
                result1 = res;
                console.log('<db.update> Updated ' + result1.affectedRows + ' row(s)');
                // If Node 1 was not updated, do a rollback
                if(result1.affectedRows == 0)
                    throw new Error();
                // If Node 1 was updated, commit
                else {
                    // Commit updates to Node 1
                    return conn('COMMIT')
                    .then((res) => {
                        console.log('<db.update> Committing transaction 1');
                        return conn2('START TRANSACTION');
                    })
                    // Start transaction for Node 2
                    .then((res) => {
                        transact2 = true;
                        console.log('<db.update> Starting transaction 2');
                        return conn2('UPDATE ' + tablename + ' SET ' + query + ' WHERE ' + conditions);
                    })
                    // Attempt to update Node 2
                    .then((res) => {
                        result2 = res;
                        console.log('<db.update> Updated ' + result2.affectedRows + ' row(s)');
                        // If Node 2 was not updated, do a rollback
                        if(result2.affectedRows == 0)
                            throw new Error();
                        // If Node 2 was updated, commit
                        else {
                            // Commit updates to Node 2
                            return conn2('COMMIT')
                            .then((res) => {
                                console.log('<db.update> Committing transaction 2');
                                var result = [result1, result2];
                                return resolve(result);
                            })
                        }
                    })
                    .catch((err) => {
                        console.error('<db.update> Error - transaction 2 modified 0 records');
                        return conn('ROLLBACK');
                    })
                    // Rollback changes to Node 2
                    .then((res) => {
                        console.log('<db.update> Rolling back transaction 2');
                        return reject(new Error());
                    });
                }
            })
            .catch((err) => {
                console.error('<db.update> Error - transaction 1 modified 0 records');
                return conn('ROLLBACK');
            })
            // Rollback changes to Node 1
            .then((res) => {
                console.log('<db.update> Rolling back transaction 1');
                return reject(new Error());
            });
        });
    },

    delete: async(conn, tablename, conditions) => {
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.delete> Starting transaction');
                return conn('DELETE FROM ' + tablename + ' WHERE ' + conditions);
            })
            .then((res) => {
                result = res;
                console.log('<db.delete> Deleted ' + result.affectedRows + ' row(s)');
                return conn('COMMIT');
            })
            .then((res) => {
                console.log('<db.delete> Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('<db.delete> Error - ', err);
                return reject(err);
            });
        });
    },

    deleteTwoNodes: async(conn, conn2, tablename, conditions) => {
        var result1, result2;
        var transact1 = false, transact2 = false;
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            // Start transaction for Node 1
            .then((res) => {
                transact1 = true
                console.log('<db.delete> Starting transaction 1');
                return conn('DELETE FROM ' + tablename + ' WHERE ' + conditions);
            })
            // Attempt to delete from Node 1
            .then((res) => {
                result1 = res;
                console.log('<db.delete> Deleted ' + result1.affectedRows + ' row(s)');
                // If Node 1 was not updated, do a rollback
                if(result1.affectedRows == 0)
                    throw new Error();
                // If Node 1 was updated, start a transaction for Node 2
                else {
                    // Commit updates to Node 1
                    return conn('COMMIT')
                    .then((res) => {
                        console.log('<db.delete> Committing transaction 1');
                        return conn2('START TRANSACTION');
                    })
                    // Start transaction for Node 2
                    .then((res) => {
                        transact2 = true
                        console.log('<db.delete> Starting transaction 2');
                        return conn2('DELETE FROM ' + tablename + ' WHERE ' + conditions);
                    })
                    // Attempt to delete from Node 2
                    .then((res) => {
                        result2 = res;
                        console.log('<db.delete> Deleted ' + result2.affectedRows + ' row(s)');
                        // If Node 2 was not updated, do a rollback
                        if(result2.affectedRows == 0)
                            throw new Error();
                        // If Node 2 was updated, commit changes for Node 1 and 2
                        else {
                            // Commit updates to Node 2
                            return conn2('COMMIT')
                            .then((res) => {
                                console.log('<db.delete> Committing transaction 2');
                                return resolve(result);
                            })
                        }
                    })
                    .catch((err) => {
                        console.error('<db.delete> Error - transaction 2 modified 0 records');
                        return conn('ROLLBACK');
                    })
                    // Rollback changes to Node 2
                    .then((res) => {
                        console.log('<db.delete> Rolling back transaction 2');
                        return reject(new Error());
                    });
                }
            })
            .catch((err) => {
                console.error('<db.delete> Error - transaction 1 modified 0 records');
                return conn('ROLLBACK');
            })
            // Rollback changes to Node 1
            .then((res) => {
                console.log('<db.insert> Rolling back transaction 1');
                return reject(new Error());
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