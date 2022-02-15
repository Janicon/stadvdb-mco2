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
    },

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
    }
}

module.exports = controller;