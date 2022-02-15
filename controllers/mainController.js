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
        var result = await db.findAll(connections.node1p, 'den_imdb');
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
