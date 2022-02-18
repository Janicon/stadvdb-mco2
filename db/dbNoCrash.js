const dbNoCrash = {
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
};

module.exports = dbNoCrash;