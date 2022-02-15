const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const db = require('../db/db.js');

const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getUser: async(req, res) => {
        var id = req.params.id;
        var page_content = {
            users: []
        };

        var temp = {
            id: 0,
            fname: 'name',
            lname: 'name'
        };
        page_content.users.push(temp);

        var result = await db.find(connections.testp, 'users', 'id=' + id);

        var user = {
            id: result[0].id,
            fname: result[0].fname,
            lname: result[0].lname
        };
        console.log(user);

        res.render('test', page_content);
    },

    /*
    loadPage: async(req, res) => {
        var userlist = [];
        const result = await db.getAll(connections.test, 'users');

        result.forEach(function (result) {
            var user = {
                id: result.id,
                fname: result.fname,
                lname: result.lname
            };

            userlist.push(user);
        });
        console.log(result);
        console.log (userlist);
        res.render('test', {users: userlist});
    },

    testTransaction: function(req, res) {
        var page_content = {
            users: []
        };

        var temp = {
            id: 0,
            fname: 'name',
            lname: 'name'
        };

        db.testTransaction(connections.test, () => {
            res.render('test', page_content);
        });
    },
    findCount: function(req, res) {
        var page_content = {
            users: []
        };

        var temp = {
            id: 0,
            fname: 'name',
            lname: 'name'
        };

        page_content.users.push(temp);

        db.findCount(connections.test, 'users', function(result) {
            console.log(result[0].count);
            res.render('test', page_content);
        })
    },

    loadPage: async(req, res) => {
        var userlist = [];
        const result = await db.getAll(connections.test, 'users');

        result.forEach(function (result) {
            var user = {
                id: result.id,
                fname: result.fname,
                lname: result.lname
            };

            userlist.push(user);
        });
        console.log(result);
        console.log (userlist);
        res.render('test', {users: userlist});
    },
    */

    getUsers: async(req, res) => {
        var page_content = {
            users: []
        };

        res.locals.page_content = page_content;
        var result = await db.findAll(connections.testp, 'users');
        var userlist = [];

        for (var i in result) {
            var user = {
                id: result[i].id,
                fname: result[i].fname,
                lname: result[i].lname
            };

            userlist.push(user);
        }

        page_content.users = userlist;

        res.render('test', page_content);
    },

    addUser: function(req, res) {
        var values = '';
        values += req.query.id + ', ';
        values += '"' + req.query.fname + '", ';
        values += '"' + req.query.lname + '"'

        db.insertOne(connections.test, 'users', values, function(result) {
            if(result) {
                console.log('Review Insert: Success');
            }
            else {
                console.log('User Insert: Error - could not insert record.');
                res.redirect('/test');
            }
        });
    }
}

module.exports = controller;