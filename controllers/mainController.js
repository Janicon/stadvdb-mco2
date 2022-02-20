const connections = require('../db/connections.js');
const db = require('../db/db.js');
const reportdb = require('../db/reports.js');
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

    getBlank: function(req, res) {
        res.render('home',{});
    },

    getIndex: async(req, res) => {
        var result;
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(!n1crashed) {
                console.log('<mainController> getIndex: Querying from Node 1');
                result = await db.findAll(n1p, 'den_imdb');
            }
            else {
                console.log('<mainController> getIndex: Node 1 is down; querying node 2 and 3');
                result = await db.findAll(n2p, 'den_imdb');
                result = result.concat(await db.findAll(n3p, 'den_imdb'));
            }
            
            var movielist = [];
            for (var i in result) {
                var movie = {
                    title: result[i].name,
                    id: result[i].id
                };
    
                movielist.push(movie);
                
                if (i == 150)
                    break;
            }
            
            res.render('home', {movieIds: movielist});
        } catch (err) {
            console.log('<mainController> getIndex: Error - ' + err);
            res.redirect('/error');
        }
    },

    getGenreCounts: async(req, res) => {
        var result;
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(!n1crashed) {
                console.log('<mainController> getGenreCounts: Querying from Node 1');
                result = await reportdb.genreCountMovies(n1p, 'den_imdb');
            }
            else {
                console.log('<mainController> getGenreCounts: Node 1 is down; querying node 2 and 3');
                result = await reportdb.genreCountMovies(n2p, 'den_imdb');
                result = result.concat(await reportdb.genreCountMovies(n3p, 'den_imdb'));
            }
            
            var reports = [];
            for (var i in result) {
                var genre = {
                    label: result[i].GENRE,
                    data: result[i].NUM_MOVIES
                };
    
                reports.push(genre);
            }
            
            res.send(reports);
        } catch (err) {
            console.log('<mainController> getGenreCounts: Error - ' + err);
            res.redirect('/');
        }
    },

    getGenreRanks: async(req, res) => {
        var result;
                if (n1crashed){
                    n = connections.crash;
                    n1p = connections.nodecp;
                    }
                else{
                     n = connections.node1;
                    n1p = connections.node1p;
                }
                if (n2crashed){
                    n = connections.crash;
                    n2p = connections.nodecp;
                }
                else{
                     n = connections.node2;
                    n2p = connections.node2p;
                }
                if (n3crashed){
                    n = connections.crash;
                    n3p = connections.nodecp;
                }
                else{
                     n = connections.node3;
                    n3p = connections.node3p;
                }
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(n.state !== 'disconnected') {
                console.log('<mainController> getGenreRanks: Querying from Node 1');
                result = await reportdb.genreAvgRank(n1p, 'den_imdb');
            }
            else {
                console.log('<mainController> getGenreRanks: Node 1 is down; querying node 2 and 3');
                result = await reportdb.genreAvgRank(n2p, 'den_imdb');
                result = result.concat(await reportdb.genreAvgRank(n3p, 'den_imdb'));
            }
            
            var reports = [];
            for (var i in result) {
                var genre = {
                    label: result[i].GENRE,
                    data: result[i].AVG_RANK
                };
    
                reports.push(genre);
            }
            
            res.send(reports);
        } catch (err) {
            console.log('<mainController> getGenreRanks: Error - ' + err);
            res.redirect('/');
        }
    },

    getDirectorCounts: async(req, res) => {
        var result;
                if (n1crashed){
                    n = connections.crash;
                    n1p = connections.nodecp;
                    }
                else{
                     n = connections.node1;
                    n1p = connections.node1p;
                }
                if (n2crashed){
                    n = connections.crash;
                    n2p = connections.nodecp;
                }
                else{
                     n = connections.node2;
                    n2p = connections.node2p;
                }
                if (n3crashed){
                    n = connections.crash;
                    n3p = connections.nodecp;
                }
                else{
                     n = connections.node3;
                    n3p = connections.node3p;
                }
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(n.state !== 'disconnected') {
                console.log('<mainController> getDirectorCounts: Querying from Node 1');
                result = await reportdb.directorCountMovies(n1p, 'den_imdb');
            }
            else {
                console.log('<mainController> getDirectorCounts: Node 1 is down; querying node 2 and 3');
                result = await reportdb.directorCountMovies(n2p, 'den_imdb');
                result = result.concat(await reportdb.directorCountMovies(n3p, 'den_imdb'));
            }
            
            var reports = [];
            for (var i in result) {
                var genre = {
                    label: result[i].DIRECTOR,
                    data: result[i].NUM_MOVIES
                };
    
                reports.push(genre);
            }
            
            res.send(reports);
        } catch (err) {
            console.log('<mainController> getDirectorCounts: Error - ' + err);
            res.redirect('/');
        }
    },

    getActorCounts: async(req, res) => {
        var result;
                if (n1crashed){
                    n = connections.crash;
                    n1p = connections.nodecp;
                    }
                else{
                     n = connections.node1;
                    n1p = connections.node1p;
                }
                if (n2crashed){
                    n = connections.crash;
                    n2p = connections.nodecp;
                }
                else{
                     n = connections.node2;
                    n2p = connections.node2p;
                }
                if (n3crashed){
                    n = connections.crash;
                    n3p = connections.nodecp;
                }
                else{
                     n = connections.node3;
                    n3p = connections.node3p;
                }
        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(n.state !== 'disconnected') {
                console.log('<mainController> getActorCounts: Querying from Node 1');
                result = await reportdb.actorCountMovies(n1p, 'den_imdb');
            }
            else {
                console.log('<mainController> getActorCounts: Node 1 is down; querying node 2 and 3');
                result = await reportdb.actorCountMovies(n2p, 'den_imdb');
                result = result.concat(await reportdb.actorCountMovies(n3p, 'den_imdb'));
            }
            
            var reports = [];
            for (var i in result) {
                var genre = {
                    label: result[i].ACTOR1,
                    data: result[i].NUM_MOVIES
                };
                
                reports.push(genre);
            }
            
            res.send(reports);
        } catch (err) {
            console.log('<mainController> getActorCounts: Error - ' + err);
            res.redirect('/');
        }
    },

    getEmpty: function(req, res) {
        res.status('204');
        res.render('empty');
    },

    getError: function(req, res) {
        res.status('404');
        res.render('error');
    },
    crashNode1: function(req, res){
        if (!n1crashed)
            {console.log('<mainController> Crashing Node 1');}
        else {
            console.log('<mainController> Restoring Node 1');
            recovery.recoverPrimary();
        }

        n1crashed = !n1crashed;
        n2crashed = false;
        n3crashed = false;
        res.end();
    },

    crashNode2: function(req, res){
        if (!n2crashed)
            console.log('<mainController> Crashing Node 2');
        else {
            console.log('<mainController> Restoring Node 2');
            recovery.recoverSecondary('Node 2');
        }

        n1crashed = false;
        n2crashed = !n2crashed;
        n3crashed = false;
        res.end();
    },
    crashNode3: function(req, res) {
        if (!n3crashed)
            console.log('<mainController> Crashing Node 3');
        else {
            console.log('<mainController> Restoring Node 3');
            recovery.recoverSecondary('Node 3');
        }

        n1crashed = false;
        n2crashed = false;
        n3crashed = !n3crashed;
        res.end();
    },
}

module.exports = controller;
