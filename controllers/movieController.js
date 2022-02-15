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
            res.redirect('/');
        }            
    }
}

module.exports = controller;