const e = require('express');
const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const db = require('../db/db.js');
var crashed = false;
var n = connections.node1;
hashCode = function(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

setInterval( function(){
  if (n.state !== 'disconnected') {

  }

},1000)
const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getMovie: async(req, res) => {

        var id = req.params.id;
        var result;
                 if (crashed)
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
                console.log('<movieController> getIndex: Node 1 is down; querying node 2 and 3');
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

    /*
    addMovie: async(req, res) => {
        var values = req.body.addId + ', '
            + req.body.addName + ', '
            + req.body.addYear + ', '
            + req.body.addRank + ', '
            + req.body.addGenre + ', '
            + req.body.addDirector + ', '
            + req.body.addActor1 + ', '
            + req.body.addActor2;

        // Try to write to Node 1
        
        try {
            await db.find(connections.node1p, 'den_imdb', 'id=' + id);
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
            console.log('<movieController.addMovie> Error writing to nodes');
            res.redirect('/');
        }
    },
    */

    addMovie: async(req, res) => {
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
                connections.node1.query('INSERT INTO logs VALUES ('+logs+')');
                connections.node2.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> addMovie: Inserting to Node 1 and 2');
                await db.insertTwoNodes(connections.node1p, connections.node2p, 'den_imdb', values);
                connections.node1.query(log_commit);
                connections.node2.query(log_commit);
            }
            else {
            connections.node1.query('INSERT INTO logs VALUES ('+logs+')');
            connections.node3.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> addMovie: Inserting to Node 1 and 3');
                await db.insertTwoNodes(connections.node1p, connections.node3p, 'den_imdb', values);
                connections.node1.query(log_commit);
                connections.node3.query(log_commit);
            }
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
        console.log(err);
            console.log('<movieController> addMovie: Error - Could not write to both nodes');
            res.redirect('/');
        }
    },

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
            if (req.body.addYear < 1980) {
                connections.node1.query('INSERT INTO logs VALUES ('+logs+')');
                 connections.node2.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> editMovie: Writing to Node 1 and 2');
                await db.updateTwoNodes(connections.node1p, connections.node2p, 'den_imdb', columns, values, conditions);
                connections.node1.query(log_commit);
                connections.node2.query(log_commit);
            }
            else {
                connections.node1.query('INSERT INTO logs VALUES ('+logs+')');
                connections.node3.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> editMovie: Writing to Node 1 and 3');
                await db.updateTwoNodes(connections.node1p, connections.node3p, 'den_imdb', columns, values, conditions);
                connections.node1.query(log_commit);
                connections.node3.query(log_commit);
            }

            res.redirect('/movie/' + req.params.id);
        } catch (err) {
            console.log('<movieController> editMovie: Error - DB Update');
            res.redirect('/movie/' + req.params.id);
        }
    },

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
            const d = new Date();
            console.log(d);
            let time = d.getTime();
            console.log(time);
        var year = req.query.year;
        var conditions = 'id=' + req.params.id;

         var temp = '"DELETE", '
                +req.params.id + ', '
                + 'NULL, '
                + '-1, '
                +'-1, '
                + 'NULL, '
                + 'NULL, '
                + 'NULL, '
                + 'NULL, ' + 'FALSE'

                var logs = d;

                logs = '"' +  logs + '", ' + temp;
                console.log(d);
         var log_commit = 'UPDATE logs SET committed = TRUE WHERE log_id = "' + d + '"';
        
        try {            
            if (year < 1980) {
                connections.node1.query('INSERT INTO logs VALUES ('+logs+')');
                connections.node2.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> addMovie: Deleting from Node 1 and 2');
                await db.deleteTwoNodes(connections.node1p, connections.node2p, 'den_imdb', conditions);
                connections.node1.query(log_commit);
                connections.node2.query(log_commit);
            }
            else {
                connections.node1.query('INSERT INTO logs VALUES ('+logs+')');
                connections.node2.query('INSERT INTO logs VALUES ('+logs+')');
                console.log('<movieController> addMovie: Deleting from Node 1 and 3');
                await db.deleteTwoNodes(connections.node1p, connections.node3p, 'den_imdb', conditions);
                connections.node1.query(log_commit);
                connections.node3.query(log_commit);
            }

            res.redirect('/');
        } catch(err) {
            console.log('<movieController> deleteMovie: Error - DB Delete');
            res.redirect('/movie/' + req.params.id);
        }
    },
          crashNode1: function(req, res){
                         if (!crashed)
                             console.log('<movieController> Crashing Node 1');

                         else
                            console.log('<movieController> Restoring Node 1');

                         if(crashed == true)
                                   crashed = false;
                                   else
                                   crashed = true;

                        },
               crashNode2: function(req, res){
                         if (!crashed)
                             console.log('<movieController> Crashing Node 2');

                         else
                            console.log('<movieController> Restoring Node 2');


                           if(crashed == true)
                                     crashed = false;
                                     else
                                     crashed = true;


                      },
              crashNode3: function(req, res) {
                         if (!crashed)
                             console.log('<movieController> Crashing Node 3');

                         else
                            console.log('<movieController> Restoring Node 3');
                           if(crashed == true)
                                     crashed = false;
                                     else
                                     crashed = true;
                       }

}

module.exports = controller;