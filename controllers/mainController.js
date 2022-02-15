const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const db = require('../db/db.js');

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
            if(connections.node1.state !== 'disconnected') {
                console.log('<mainController> getIndex: Querying from Node 1');
                result = await db.findAll(connections.node1p, 'den_imdb');
            }
            else {
                console.log('<mainController> getIndex: Node 1 is down; querying node 2 and 3');
                result = await db.findAll(connections.node2p, 'den_imdb');
                result = result.concat(await db.findAll(connections.node3p, 'den_imdb'));
            }
            
            var movielist = [];
            for (var i in result) {
                var movie = {
                    title: result[i].name,
                    id: result[i].id
                };
    
                movielist.push(movie);
                
                if (i == 30)
                    break;
            }
            
            res.render('home', {movieIds: movielist});
        } catch (err) {
            console.log('<mainController> getIndex: Error - ' + err);
            res.redirect('/error');
        }
    },

    getEmpty: function(req, res) {
        res.status('204');
        res.render('empty');
    },

    getError: function(req, res) {
        res.status('404');
        res.render('error');
    }
}

module.exports = controller;
