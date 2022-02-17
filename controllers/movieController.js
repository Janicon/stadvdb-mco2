const e = require('express');
const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const db = require('../db/db.js');

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
            if(connections.node1.state !== 'disconnected') {
                console.log('<movieController> getMovie: Querying from Node 1');
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
        var values = req.body.addId + ', '
            + '"' + req.body.addName + '", '
            + req.body.addYear + ', '
            + req.body.addRank + ', '
            + '"' + req.body.addGenre + '", '
            + '"' + req.body.addDirector + '", '
            + '"' + req.body.addActor1 + '", '
            + '"' + req.body.addActor2 + '"';

        console.log('<movieController> addMovie: Adding movie to DB');
        console.log('<movieController> addMovie: ' + values);
        try {
            if (req.body.addYear < 1980) {
                console.log('<movieController> addMovie: Inserting to Node 1 and 2');
                await db.insertTwoNodes(connections.node1p, connections.node2p, 'den_imdb', values);
            }
            else {
                console.log('<movieController> addMovie: Inserting to Node 1 and 3');
                await db.insertTwoNodes(connections.node1p, connections.node3p, 'den_imdb', values);
            }
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
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
            columns.push('`rank`');
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
                console.log('<movieController> editMovie: Writing to Node 1 and 2');
                await db.updateTwoNodes(connections.node1p, connections.node2p, 'den_imdb', columns, values, conditions);
            }
            else {
                console.log('<movieController> editMovie: Writing to Node 1 and 3');
                await db.updateTwoNodes(connections.node1p, connections.node3p, 'den_imdb', columns, values, conditions);
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
        var year = req.query.year;
        var conditions = 'id=' + req.params.id;
        
        try {            
            if (year < 1980) {
                console.log('<movieController> addMovie: Deleting from Node 1 and 2');
                await db.deleteTwoNodes(connections.node1p, connections.node2p, 'den_imdb', conditions);
            }
            else {
                console.log('<movieController> addMovie: Deleting from Node 1 and 3');
                await db.deleteTwoNodes(connections.node1p, connections.node3p, 'den_imdb', conditions);
            }
            res.redirect('/');
        } catch(err) {
            console.log('<movieController> deleteMovie: Error - DB Delete');
            res.redirect('/movie/' + req.params.id);
        }
    }
}

module.exports = controller;