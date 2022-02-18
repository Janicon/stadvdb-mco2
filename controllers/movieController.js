const e = require('express');
const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const { connect } = require('../db/db.js');
const db = require('../db/db.js');
var n1crashed = false;
var n1crashed2 = false;
var n2crashed = false;
var n3crashed = false;
var n = connections.node1;
var n2 = connections.node2;
var n3 = connections.node3;



const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getMovie: async(req, res) => {

        var id = req.params.id;
        var result;
                 if (n1crashed)
                    n = connections.crash
                else
                    n = connections.node1;
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(n.state !== 'disconnected') {
                console.log('<movieController> getIndex: Querying from Node 1');
                result = await db.find(connections.node1p, 'den_imdb', 'id=' + id);
            }
            else {
                console.log('<movieController> getMovie: Node 1 is down; querying node 2 and 3');
                result = await db.find(connections.node2p, 'den_imdb', 'id=' + id);
                result = result.concat(await db.find(connections.node3p, 'den_imdb', 'id=' + id));
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
                // Insert log for node 1 and perform write
                console.log('<movieController> addMovie: Inserting Node 1 log');
                await db.insert(connections.node1p, 'logs', log);

                console.log('<movieController> addMovie: Inserting Node 1 record');
                await db.insert(connections.node1p, 'den_imdb', values);

                console.log('<movieController> addMovie: Updating Node 1 log');
                await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));

                // Insert log for node 2 and perform write
                console.log('<movieController> addMovie: Inserting Node 2 log');
                await db.insert(connections.node2p, 'logs', log);

                console.log('<movieController> addMovie: Inserting Node 2 record');
                await db.insert(connections.node2p, 'den_imdb', values);

                console.log('<movieController> addMovie: Updating Node 2 log');
                await db.update(connections.node2p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
            }
            else {
                // Insert log for node 1 and perform write
                console.log('<movieController> addMovie: Inserting Node 1 log');
                await db.insert(connections.node1p, 'logs', log);

                console.log('<movieController> addMovie: Inserting Node 1 record');
                await db.insert(connections.node1p, 'den_imdb', values);

                console.log('<movieController> addMovie: Updating Node 1 log');
                await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));

                // Insert log for node 2 and perform write
                console.log('<movieController> addMovie: Inserting Node 3 log');
                await db.insert(connections.node3p, 'logs', log);

                console.log('<movieController> addMovie: Inserting Node 3 log');
                await db.insert(connections.node3p, 'den_imdb', values);

                console.log('<movieController> addMovie: Updating Node 3 log');
                await db.update(connections.node3p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
            }
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
        console.log(err);
            console.log('<movieController> addMovie: Error - Could not write to both nodes');
            res.redirect('/');
        }
    },

    /*
    addMovie: async(req, res) => {
    var addCrash = false;
        const d = new Date();
        console.log(d);
        let time = d.getTime();
        console.log(time);
        var values = req.body.addId + ', '
            + '"' + req.body.addName + '", '
            + req.body.addYear + ', '
            + req.body.addRank + ', '
            + '"' + req.body.addGenre + '", '
            + '"' + req.body.addDirector + '", '
            + '"' + req.body.addActor1 + '", '
            + '"' + req.body.addActor2 + '"';

              var temp = '"INSERT", '
                            + '"' + req.body.addId + '", '
                            + '"' + req.body.addName + '", '
                            + req.body.addYear + ', '
                            + req.body.addRank + ', '
                            + '"' + req.body.addGenre + '", '
                            + '"' + req.body.addDirector + '", '
                            + '"' + req.body.addActor1 + '", '
                            + '"' + req.body.addActor2 + '", ' + 'FALSE'

                            var logs = d;

                            logs = '"' +  logs + '", ' + temp;
                            console.log(logs);
    var log_commit = 'UPDATE logs SET committed = TRUE WHERE log_id = "' + d + '"';

        console.log('<movieController> addMovie: Adding movie to DB');
        console.log('<movieController> addMovie: ' + values);
        try {
            if (req.body.addYear < 1980) {
                n.query('INSERT INTO logs VALUES ('+logs+')');
                n2.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> addMovie: Inserting to Node 1 and 2');
                await db.insertTwoNodes(connections.node1p, connections.node2p, 'den_imdb', values);
                if (n1crashed2== true){
                n = connections.crash;
                }
                if(n.state !== 'disconnected')
               {
               n.query(log_commit);
               n2.query(log_commit);
                 }

               if (n1crashed2== true){
                    n1crashed2 = false;
                    n = connections.node1;
               }

            }
            else {
            n.query('INSERT INTO logs VALUES ('+logs+')');
            n3.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> addMovie: Inserting to Node 1 and 3');
                await db.insertTwoNodes(connections.node1p, connections.node3p, 'den_imdb', values);
                if (n1crashed2== true){
                n = connections.crash;
                }
                if(n.state !== 'disconnected')
                               {
               n.query(log_commit);
               n3.query(log_commit);
               }

               if (n1crashed2== true){
                    n1crashed2 = false;
                    n = connections.node1;
               }
            }
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
        console.log(err);
            console.log('<movieController> addMovie: Error - Could not write to both nodes');
            res.redirect('/');
        }
    },
    */

    /*
    editMovie: async(req, res) => {
        var columns = [];
        var values = [];
        var conditions = 'id=' + req.params.id;

        if(req.body.editName != '') {
            columns.push('name');
            values.push(req.body.editName);
        }
        if(req.body.editYear != '') {
            columns.push('year');
            values.push(req.body.editYear);
        }
        if(req.body.editRank != '') {
            columns.push('rank');
            values.push(req.body.editRank);
        }
        if(req.body.editGenre != '') {
            columns.push('genre');
            values.push(req.body.editGenre);
        }
        if(req.body.editDirector != '') {
            columns.push('director');
            values.push(req.body.editDirector);
        }
        if(req.body.editActor1 != '') {
            columns.push('actor1');
            values.push(req.body.editActor1);
        }
        if(req.body.editActor2 != '') {
            columns.push('actor2');
            values.push(req.body.editActor2);
        }
        
        try {
            var result = await db.update(connections.node1p, 'den_imdb', columns, values, conditions);
            res.redirect('/movie/' + req.params.id);
        } catch (err) {
            console.log('movieController: Error - DB Insert.');
            res.redirect('/');
        }
    },
    */

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
                // Insert log for node 1 and perform write
                console.log('<movieController> editMovie: Inserting Node 1 log');
                await db.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

                // update data in node 1
                console.log('<movieController> editMovie: Update Node 1 record ' + conditions + ' year ' + year);
                // update: async(conn, tablename, columns, values, conditions)
                await db.update(connections.node1p, 'den_imdb', columns, values, conditions);

                console.log('<movieController> editMovie: Updating Node 1 log ');
                await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));

                // Insert log for node 2 and perform write
                console.log('<movieController> editMovie: Inserting Node 2 log');
                await db.insertSpecific(connections.node2p, 'logs', logColumns, logValues);

                console.log('<movieController> editMovie: Updating Node 2 record ' + conditions + ' year ' + year);
                 await db.update(connections.node2p, 'den_imdb', columns, values, conditions + ' year ' + year);

                console.log('<movieController> editMovie: Updating Node 2 log');
                await db.update(connections.node2p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
            }
            else {
                 // Insert log for node 1 and perform write
                console.log('<movieController> editMovie: Inserting Node 1 log');
                await db.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

                // update data in node 1
                console.log('<movieController> editMovie: Updating Node 1 record ' + conditions + ' year ' + year);
                // update: async(conn, tablename, columns, values, conditions)
                await db.update(connections.node1p, 'den_imdb', columns, values, conditions);

                console.log('<movieController> editMovie: Updating Node 1 log');
                await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));

                // Insert log for node 2 and perform write
                console.log('<movieController> editMovie: Inserting Node 3 log');
                await db.insertSpecific(connections.node3p, 'logs', logColumns, logValues);

                console.log('<movieController> editMovie: Updating Node 3 record ' + conditions + ' year ' + year);
                await db.update(connections.node3p, 'den_imdb', columns, values, conditions);

                console.log('<movieController> editMovie: Updating Node 3 log');
                await db.update(connections.node3p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
            }
            res.redirect('/movie/' + req.params.id);
        } catch (err) {
        console.log(err);
            console.log('<movieController> editMovie: Error - Could not write to both nodes');
            res.redirect('/');
        }
    },

    /*
    const d = new Date();
            console.log(d);
            let time = d.getTime();
            console.log(time);
    var t1 = req.body.editYear;
    if (t1 == "")
    t1 = -1;
    var t2 = req.body.editRank;
        if (t2 == "")
        t2 = -1;
    var temp = '"UPDATE", '
        + '-1, '
        + '"' + req.body.editName + '", '
        + t1 + ', '
        + t2 + ', '
        + '"' + req.body.editGenre + '", '
        + '"' + req.body.editDirector + '", '
        + '"' + req.body.editActor1 + '", '
        + '"' + req.body.editActor2 + '", ' + 'FALSE'

        var logs = d;

        logs = '"' +  logs + '", ' + temp;

    var log_commit = 'UPDATE logs SET committed = TRUE WHERE log_id = "' + d + '"';
        var columns = [];
        var values = [];
        var conditions = 'id=' + req.params.id;

        if(req.body.editName != '') {
            columns.push('name');
            values.push(req.body.editName);
        }
        if(req.body.editYear != '') {
            columns.push('year');
            values.push(req.body.editYear);
        }
        if(req.body.editRank != '') {
            columns.push('rank');
            values.push(req.body.editRank);
        }
        if(req.body.editGenre != '') {
            columns.push('genre');
            values.push(req.body.editGenre);
        }
        if(req.body.editDirector != '') {
            columns.push('director');
            values.push(req.body.editDirector);
        }
        if(req.body.editActor1 != '') {
            columns.push('actor1');
            values.push(req.body.editActor1);
        }
        if(req.body.editActor2 != '') {
            columns.push('actor2');
            values.push(req.body.editActor2);
        }
        
        try {
            if (req.body.editYear < 1980) {
                n.query('INSERT INTO logs VALUES ('+logs+')');
                n2.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> editMovie: Writing to Node 1 and 2');
                await db.updateTwoNodes(connections.node1p, connections.node2p, 'den_imdb', columns, values, conditions);
                if (n1crashed2== true){
                n = connections.crash;
                }
                if(n.state !== 'disconnected')
                               {
               n.query(log_commit);
               n2.query(log_commit);
               }

               if (n1crashed2== true){
                    n1crashed2 = false;
                    n = connections.node1;
               }
            }
            else {
                n.query('INSERT INTO logs VALUES ('+logs+')');
                n3.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> editMovie: Writing to Node 1 and 3');
                await db.updateTwoNodes(connections.node1p, connections.node3p, 'den_imdb', columns, values, conditions);
            }

            res.redirect('/movie/' + req.params.id);
        } catch (err) {
            console.log('<movieController> editMovie: Error - DB Update');
            res.redirect('/movie/' + req.params.id);
        }
        */

    /*
    deleteMovie: async(req, res) => {
        var conditions = 'id=' + req.params.id;

        try {            
            await db.delete(connections.testp, 'users', conditions);
            res.redirect('/');
        } catch(err) {
            res.redirect('/movie/' + req.params.id);
        }
    }
    */

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
               // Insert log for node 1 and perform write
               console.log('<movieController> deleteMovie: Inserting Node 1 log');
               await db.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

               // update data in node 1
               console.log('<movieController> deleteMovie: Delete Node 1 record ' + conditions + ' year ' + year);
               //  delete: async(conn, tablename, conditions) => {
               await db.delete(connections.node1p, 'den_imdb', conditions);

               console.log('<movieController> deleteMovie: Updating Node 1 log');
               await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));

               // Insert log for node 2 and perform write
               console.log('<movieController> deleteMovie: Inserting Node 2 log');
               await db.insertSpecific(connections.node2p, 'logs', logColumns, logValues);

               console.log('<movieController> deleteMovie: Delete Node 2 record ' + conditions + ' year ' + year);
               await db.delete(connections.node2p, 'den_imdb', conditions);

               console.log('<movieController> deleteMovie: Updating Node 2 log');
               await db.update(connections.node2p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
           }
           else {
                // Insert log for node 1 and perform write
               console.log('<movieController> deleteMovie: Inserting Node 1 log');
               await db.insertSpecific(connections.node1p, 'logs', logColumns, logValues);

               // update data in node 1
               console.log('<movieController> deleteMovie: Delete Node 1 record ' + conditions + ' year ' + year);
               //  delete: async(conn, tablename, conditions) => {
               await db.delete(connections.node1p, 'den_imdb', conditions);

               console.log('<movieController> deleteMovie: Updating Node 1 log');
               await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));

               // Insert log for node 3 and perform write
               console.log('<movieController> deleteMovie: Inserting Node 3 log');
               await db.insertSpecific(connections.node3p, 'logs', logColumns, logValues);

               console.log('<movieController> deleteMovie: Delete Node 3 record ' + conditions + ' year ' + year);
               await db.delete(connections.node3p, 'den_imdb', conditions);

               console.log('<movieController> deleteMovie: Updating Node 3 log');
               await db.update(connections.node3p, 'logs', ['committed'], ['TRUE'], ('date=' + datetime));
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

                     else
                        console.log('<movieController> Restoring Node 1');

                     if(n1crashed == true)
                               n1crashed = false;
                               else
                               n1crashed = true;

                    },
             crashNode1befMV: function(req, res){
                     if (!n1crashed)
                         console.log('<movieController> Crashing Node 1');

                     else
                        console.log('<movieController> Restoring Node 1');

                     if(n1crashed2 == true)
                               n1crashed2 = false;
                               else
                               n1crashed2 = true;

                    },
           crashNode2: function(req, res){
                     if (!n2crashed)
                         console.log('<movieController> Crashing Node 2');

                     else
                        console.log('<movieController> Restoring Node 2');


                       if(n2crashed == true)
                                 n2crashed = false;
                                 else
                                 n2crashed = true;


                  },
          crashNode3: function(req, res) {
                     if (!n3crashed)
                         console.log('<movieController> Crashing Node 3');

                     else
                        console.log('<movieController> Restoring Node 3');
                       if(n3crashed == true)
                                 n3crashed = false;
                                 else
                                 n3crashed = true;
                   }

}

module.exports = controller;