const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const db = require('../db/db.js');

const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getMovie: async(req, res) => {
        var id = req.params.id;
        
        try {
            var result = await db.find(connections.node1p, 'den_imdb', 'id=' + id);

            var details = {
                name: result[0].name,
                year: result[0].year,
                rank: result[0].rank,
                genre: result[0].genre,
                director: result[0].director,
                actors: [result[0].actor1, result[0].actor2]
            }
    
            res.render('movie', details);
        } catch (err) {
            console.log('movieController: Error - DB Fetch.');
            res.redirect('/');
        }            
    },

    addMovie: async(req, res) => {
        var values = req.body.addId + ', '
            + req.body.addName + ', '
            + req.body.addYear + ', '
            + req.body.addRank + ', '
            + req.body.addGenre + ', '
            + req.body.addDirector + ', '
            + req.body.addActor1 + ', '
            + req.body.addActor2;

        try {
            var result = await db.insert(connections.node1p, 'den_imdb', values);
            res.redirect('/movie/' + req.body.addId);
        } catch (err) {
            console.log('movieController: Error - DB Insert.');
            res.redirect('/');
        }
    }
}

module.exports = controller;