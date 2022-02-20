const connections = require('../db/connections.js');
const db = require('../db/db.js');
const dbNC = require('../db/dbNoCrash.js');
const recovery = require('../db/recovery.js');
var n1crashed = false;
var n2crashed = false;
var n3crashed = false;
var n = connections.node1;
var n2 = connections.node2;
var n3 = connections.node3;
var n1p = connections.node1p;
var n2p = connections.node2p;
var n3p = connections.node3p;



const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getMovie: async(req, res) => {
        var id = req.params.id;
        var result;
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(!n1crashed) {
                console.log('<movieController> getIndex: Querying from Node 1');
                result = await db.find(n1p, 'den_imdb', 'id=' + id);
            }
            else {
                console.log('<movieController> getMovie: Node 1 is down; querying node 2 and 3');
                result = await db.find(n2p, 'den_imdb', 'id=' + id);
                result = result.concat(await db.find(n3p, 'den_imdb', 'id=' + id));
            }

            var details = {
                id: req.params.id,
                name: result[0].name,
                year: result[0].year,
                rank: result[0].rank,
                genre: result[0].genre,
                director: result[0].director,
                actor1: result[0].actor1,
                actor2: result[0].actor2
            }
    
            res.render('movie', details);
        } catch (err) {
            console.log('<mainController> getMovie: Error - ' + err);
            res.redirect('/error');
        }            
    },

    addMovie: async(req, res) => {
        var values = req.body.addId + ', '
            + '"' + req.body.addName + '", '
            + req.body.addYear + ', '
            + req.body.addRank + ', '
            + '"' + req.body.addGenre + '", '
            + '"' + req.body.addDirector + '", '
            + '"' + req.body.addActor1 + '", '
            + '"' + req.body.addActor2 + '"';

        // Build log file
        var datetime = '"'
        datetime += new Date().toISOString().slice(0, 19).replace('T', ' ');
        datetime += '"';

        var log = '0, '
            + datetime + ', '
            + '"INSERT", '
            + values + ', '
            + 'FALSE';

        console.log('<movieController> addMovie: Adding movie to DB');
        console.log('<movieController> addMovie: ' + values);
        try {
            if (req.body.addYear < 1980) {
                if(!n1crashed) {
                    // Insert log for node 1 and perform write
                    console.log('<movieController> addMovie: Inserting Node 1 log');
                    await dbNC.insert(connections.node1p, 'logs', log);

                    console.log('<movieController> addMovie: Inserting Node 1 record');
                    var result1 = await db.insert(n1p, 'den_imdb', values);
                    if(result1 == null)
                        throw new Error('Could not insert to node 1');

                    console.log('<movieController> addMovie: Updating Node 1 log');
                    await dbNC.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }
                if(!n2crashed) {
                    // Insert log for node 2 and perform write
                    console.log('<movieController> addMovie: Inserting Node 2 log');
                    await dbNC.insert(connections.node2p, 'logs', log);

                    console.log('<movieController> addMovie: Inserting Node 2 record');
                    var result2 = await db.insert(n2p, 'den_imdb', values);
                    if(result2 == null)
                        throw new Error('Could not insert to node 2');

                    console.log('<movieController> addMovie: Updating Node 2 log');
                    await dbNC.update(connections.node2p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }
            }
            else {
                // Insert log for node 1 and perform write
                if(!n1crashed) {
                    console.log('<movieController> addMovie: Inserting Node 1 log');
                    await dbNC.insert(connections.node1p, 'logs', log);

                    console.log('<movieController> addMovie: Inserting Node 1 record');
                    var result1 = await db.insert(n1p, 'den_imdb', values);
                    if(result1 == null)
                        throw new Error('Could not insert to node 1');

                    console.log('<movieController> addMovie: Updating Node 1 log');
                    await dbNC.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }

                if(!n3crashed) {
                    // Insert log for node 2 and perform write
                    console.log('<movieController> addMovie: Inserting Node 3 log');
                    await dbNC.insert(connections.node3p, 'logs', log);

                    console.log('<movieController> addMovie: Inserting Node 3 record');
                    var result2 = await db.insert(n3p, 'den_imdb', values);
                    if(result2 == null)
                        throw new Error('Could not insert to node 3');

                    console.log('<movieController> addMovie: Updating Node 3 log');
                    await dbNC.update(connections.node3p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }
            }
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
            console.log(err);
            console.log('<movieController> addMovie: Error - Could not write to both nodes');
            res.redirect('/');
        }
    },

    editMovie: async(req, res) => {
    var columns = [];
    var values = [];
    var conditions = 'id=' + req.params.id;

    if(req.body.editName != '') {
        columns.push('name');
        values.push('"'+req.body.editName+'"');
    }
    if(req.body.editRank != '') {
        columns.push('`rank`');
        values.push(req.body.editRank);
    }
    if(req.body.editGenre != '') {
        columns.push('genre');
        values.push('"'+req.body.editGenre+'"');
    }
    if(req.body.editDirector != '') {
        columns.push('director');
        values.push('"'+req.body.editDirector+'"');
    }
    if(req.body.editActor1 != '') {
        columns.push('actor1');
        values.push('"'+req.body.editActor1+'"');
    }
    if(req.body.editActor2 != '') {
        columns.push('actor2');
        values.push('"'+req.body.editActor2+'"');
    }
        var datetime = '"'
        datetime += new Date().toISOString().slice(0, 19).replace('T', ' ');
        datetime += '"';

     var logColumns = ['log_id', 'date', 'operation','movie_id', 'year'];
     logColumns = logColumns.concat(columns);
     var logValues = ['0', datetime, '"UPDATE"', req.params.id, req.body.editYear];
     logValues = logValues.concat(values);


        console.log('<movieController> editMovie: Editing movie ' + conditions);
        console.log('<movieController> editMovie: ' + values);
        try {
            if (req.body.editYear < 1980) {
                if(!n1crashed) {
                    // Insert log for node 1 and perform write
                    console.log('<movieController> editMovie: Inserting Node 1 log');
                    await dbNC.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

                    // update data in node 1
                    console.log('<movieController> editMovie: Update Node 1 record ' + conditions + ' year ' + year);
                    // update: async(conn, tablename, columns, values, conditions)
                    var result1 = await db.update(n1p, 'den_imdb', columns, values, conditions);
                    if(result1 == null)
                        throw new Error('Could not insert to node 1');

                    console.log('<movieController> editMovie: Updating Node 1 log ');
                    await dbNC.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }

                if(!n2crashed) {
                    // Insert log for node 2 and perform write
                    console.log('<movieController> editMovie: Inserting Node 2 log');
                    await dbNC.insertSpecific(connections.node2p, 'logs', logColumns, logValues);

                    console.log('<movieController> editMovie: Updating Node 2 record ' + conditions + ' year ' + req.body.editYear);
                    var result2 = await db.update(n2p, 'den_imdb', columns, values, conditions);
                    if(result2 == null)
                        throw new Error('Could not insert to node 2');

                    console.log('<movieController> editMovie: Updating Node 2 log');
                    await dbNC.update(connections.node2p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }
            }
            else {
                if(!n1crashed) {
                    // Insert log for node 1 and perform write
                    console.log('<movieController> editMovie: Inserting Node 1 log');
                    await dbNC.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

                    // update data in node 1
                    console.log('<movieController> editMovie: Updating Node 1 record ' + conditions + ' year ' + year);
                    // update: async(conn, tablename, columns, values, conditions)
                    var result1 = await db.update(n1p, 'den_imdb', columns, values, conditions);
                    if(result1 == null)
                        throw new Error('Could not insert to node 1');

                    console.log('<movieController> editMovie: Updating Node 1 log');
                    await dbNC.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }

                if(!n3crashed) {
                    // Insert log for node 2 and perform write
                    console.log('<movieController> editMovie: Inserting Node 3 log');
                    await dbNC.insertSpecific(connections.node3p, 'logs', logColumns, logValues);

                    console.log('<movieController> editMovie: Updating Node 3 record ' + conditions + ' year ' + year);
                    var result2 = await db.update(n3p, 'den_imdb', columns, values, conditions);
                    if(result2 == null)
                        throw new Error('Could not insert to node 3');

                    console.log('<movieController> editMovie: Updating Node 3 log');
                    await dbNC.update(connections.node3p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
                }
            }
            res.redirect('/movie/' + req.params.id);
        } catch (err) {
        console.log(err);
            console.log('<movieController> editMovie: Error - Could not write to both nodes');
            res.redirect('/');
        }
    },

    deleteMovie: async(req, res) => {
       //"DELETE FROM MyGuests WHERE id=3"
       // Build log file
       var datetime = '"'
       datetime += new Date().toISOString().slice(0, 19).replace('T', ' ');
       datetime += '"';
       var conditions = 'id=' + req.params.id;
       var year = req.query.year;

       var logColumns = ['log_id', 'date', 'operation','movie_id', 'year'];
       var logValues = ['0', datetime, '"DELETE"', req.params.id, year];

       console.log('<movieController> deleteMovie: Deleting movie id='+ req.params.id +' from DB');
       try {
           if (year < 1980) {
               if(!n1crashed) {
                // Insert log for node 1 and perform write
                console.log('<movieController> deleteMovie: Inserting Node 1 log');
                await dbNC.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

                // update data in node 1
                console.log('<movieController> deleteMovie: Delete Node 1 record ' + conditions + ' year ' + year);
                //  delete: async(conn, tablename, conditions) => {
                var result1 = await db.delete(n1p, 'den_imdb', conditions);
                if(result1 == null)
                    throw new Error('Could not insert to node 1');

                console.log('<movieController> deleteMovie: Updating Node 1 log');
                await dbNC.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
               }
               if(!n2crashed) {
                    // Insert log for node 2 and perform write
                    console.log('<movieController> deleteMovie: Inserting Node 2 log');
                    await dbNC.insertSpecific(connections.node2p, 'logs', logColumns, logValues);

                    console.log('<movieController> deleteMovie: Delete Node 2 record ' + conditions + ' year ' + year);
                    var result2 = await db.delete(n2p, 'den_imdb', conditions);
                    if(result2 == null)
                        throw new Error('Could not insert to node 2');

                    console.log('<movieController> deleteMovie: Updating Node 2 log');
                    await dbNC.update(connections.node2p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
               }
           }
           else {
               if(!n1crashed) {
                        // Insert log for node 1 and perform write
                    console.log('<movieController> deleteMovie: Inserting Node 1 log');
                    await dbNC.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

                    // update data in node 1
                    console.log('<movieController> deleteMovie: Delete Node 1 record ' + conditions + ' year ' + year);
                    //  delete: async(conn, tablename, conditions) => {
                    var result1 = await db.delete(n1p, 'den_imdb', conditions);
                    if(result1 == null)
                        throw new Error('Could not insert to node 1');

                    console.log('<movieController> deleteMovie: Updating Node 1 log');
                    await dbNC.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
               }

               if(!n3crashed) {
                    // Insert log for node 3 and perform write
                    console.log('<movieController> deleteMovie: Inserting Node 3 log');
                    await dbNC.insertSpecific(connections.node3p, 'logs', logColumns, logValues);

                    console.log('<movieController> deleteMovie: Delete Node 3 record ' + conditions + ' year ' + year);
                    var result2 = await db.delete(n3p, 'den_imdb', conditions);
                    if(result2 == null)
                        throw new Error('Could not insert to node 3');

                    console.log('<movieController> deleteMovie: Updating Node 3 log');
                    await dbNC.update(connections.node3p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
               }
           }
           res.redirect('/');
       } catch (err) {
       console.log(err);
           console.log('<movieController> deleteMovie: Error - Could not write to both nodes');
           res.redirect('/');
       }
    },

    crashNode1: function(req, res){
        if (!n1crashed)
            console.log('<movieController> Crashing Node 1');
        else {
            console.log('<movieController> Restoring Node 1');
        }

        n1crashed = !n1crashed;
        n2crashed = false;
        n3crashed = false;
        res.end();
    },

    crashNode2: function(req, res){
        if (!n2crashed)
            console.log('<movieController> Crashing Node 2');
        else {
            console.log('<movieController> Restoring Node 2');
        }

        n1crashed = false;
        n2crashed = !n2crashed;
        n3crashed = false;
        res.end();

    },

    crashNode3: function(req, res) {
        if (!n3crashed)
            console.log('<movieController> Crashing Node 3');
        else {
            console.log('<movieController> Restoring Node 3');
            recovery.recoverSecondary('Node 3');
        }
        
        n1crashed = false;
        n2crashed = false;
        n3crashed = !n3crashed;
        res.end();
    }
}

module.exports = controller;