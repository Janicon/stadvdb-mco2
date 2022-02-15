const async = require('hbs/lib/async');
const db = require('../db/db.js');

const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },
    
    getUsers: function(req, res, next) {
        var page_content = {
            users: []
        };

        db.findAll('users', function(result) {
            var userlist = [];

            if (result != null) {
                result.forEach(function (result) {
                    var user = {
                        id: result.id,
                        fname: result.fname,
                        lname: result.lname
                    };
    
                    userlist.push(user);
                });
                
                res.locals.page_content = page_content;
                page_content.users = userlist;
                next();
            }
        });
    },

    addUser: function(req, res) {
        var values = '';
        values += req.query.id + ', ';
        values += '"' + req.query.fname + '", ';
        values += '"' + req.query.lname + '"'

        db.insertOne('users', values, function(result) {
            if(result) {
                console.log('Review Insert: Success');
            }
            else {
                console.log('User Insert: Error - could not insert record.');
                res.redirect('/test');
            }
        });
    },

    load: function(req, res) {
        var page_content = res.locals.page_content;

        res.render('test', page_content);
    }
}

module.exports = controller;