var nCrash = false;

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

    query: async(conn, customQuery) => {
        var result;

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('Starting transaction');
                return conn(customQuery);
            })
            .then((res) => {
                result = res;
                console.log('<db.query> Found ' + result.length + ' row(s)');
                return conn('COMMIT');
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
                return conn('COMMIT');
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
                if(nCrash) {
                    console.log('<db.insert> Rolling back transaction');
                    result = null;
                    return conn('ROLLBACK');
                }
                console.log('<db.insert> Committing transaction');
                return conn('COMMIT');
            })
            .then((res) => {
                return resolve(result);
            })
            .catch((err) => {
                console.log('<db.insert> Rolling back transaction');
                return reject();
            });
        });
    },

    insertSpecific: async(conn, tablename, columns, values) => {
        var parseColumns = columns[0];
        var parseValues = values[0];
        for (var i = 1; i < columns.length; i++) {
            parseColumns += ', ' + columns[i];
            parseValues += ', ' + values[i];
        }

        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.insert> Starting transaction');
                return conn('INSERT INTO ' + tablename + '(' + parseColumns + ') VALUES(' + parseValues + ')');
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
                if(nCrash)
                    throw new Error();
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
                        console.log('<db.insert> Rolling back transaction 2');
                        return conn('ROLLBACK');
                    })
                    // Rollback changes to Node 2
                    .then((res) => {
                        return reject(new Error());
                    });
                }
            })
            .catch((err) => {
                console.error('<db.insert> Error - transaction 1 wrote 0 records');
                console.log('<db.insert> Rolling back transaction 1');
                return conn('ROLLBACK');
            })
            // Rollback changes to Node 1
            .then((res) => {
                return reject(new Error());
            });
        });
    },

    update: async(conn, tablename, columns, values, conditions) => {
        var result;
        var query = columns[0] + '=' + values[0] + '';
        for (var i = 1; i < columns.length; i++)
            query += ", " + columns[i] + '=' + values[i];
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.update> Starting transaction');
                return conn('UPDATE ' + tablename + ' SET ' + query + ' WHERE ' + conditions);
            })
            .then((res) => {
                result = res;
                console.log('<db.update> Updated ' + result.affectedRows + ' row(s)');
                if(nCrash) {
                    console.log('<db.insert> Rolling back transaction');
                    result = null;
                    return conn('ROLLBACK');
                }
                console.log('<db.update> Committing transaction');
                return conn('COMMIT');
            })
            .then((res) => {
                return resolve(result);
            })
            .catch((err) => {
                console.log('<db.insert> Rolling back transaction');
                return reject();
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
                if(nCrash)
                    throw new Error();
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
                        console.log('<db.update> Rolling back transaction 2');
                        return conn('ROLLBACK');
                    })
                    // Rollback changes to Node 2
                    .then((res) => {
                        return reject(new Error());
                    });
                }
            })
            .catch((err) => {
                console.error('<db.update> Error - transaction 1 modified 0 records');
                console.log('<db.update> Rolling back transaction 1');
                return conn('ROLLBACK');
            })
            // Rollback changes to Node 1
            .then((res) => {
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
                if(nCrash) {
                    console.log('<db.insert> Rolling back transaction');
                    result = null;
                    return conn('ROLLBACK');
                }
                console.log('<db.delete> Committing transaction');
                return conn('COMMIT');
            })
            .then((res) => {
                return resolve(result);
            })
            .catch((err) => {
                console.log('<db.insert> Rolling back transaction');
                return reject();
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
                // If Node 1 was updated, commit
                else {
                    // Commit updates to Node 1
                    if(nCrash)
                        throw new Error();
                    return conn('COMMIT')
                    .then((res) => {
                        console.log('<db.delete> Committing transaction 1');
                        return conn2('START TRANSACTION');
                    })
                    // Start transaction for Node 2
                    .then((res) => {
                        transact2 = true;
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
                        // If Node 2 was updated, commit
                        else {
                            // Commit updates to Node 2
                            if(nCrash)
                                throw new Error();
                            return conn2('COMMIT')
                            .then((res) => {
                                console.log('<db.delete> Committing transaction 2');
                                var result = [result1, result2];
                                return resolve(result);
                            })
                        }
                    })
                    .catch((err) => {
                        console.error('<db.delete> Error - transaction 2 modified 0 records');
                        console.log('<db.delete> Rolling back transaction 2');
                        return conn('ROLLBACK');
                    })
                    // Rollback changes to Node 2
                    .then((res) => {
                        return reject(new Error());
                    });
                }
            })
            .catch((err) => {
                console.error('<db.delete> Error - transaction 1 modified 0 records');
                console.log('<db.insert> Rolling back transaction 1');
                return conn('ROLLBACK');
            })
            // Rollback changes to Node 1
            .then((res) => {
                return reject(new Error());
            });
        });
    },
    crashNodeBef: function(req, res) {
        if (!nCrash)
            console.log('<db> Crashing Before Next Commits');
        else
            console.log('<db> Will Not Crash Before Next Commits');
        if(nCrash)
            nCrash = false;
            else
            nCrash = true;
    }
};

module.exports = db;