const async = require('hbs/lib/async');
const connections = require('../db/connections.js');
const db = require('../db/db.js');
var n1crashed = false;
var n2crashed = false;
var n3crashed = false;
const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getBlank: function(req, res) {
        res.render('home',{});
    },

    getIndex: async(req, res) => {
        var result;

        if (n1crashed){
                n = connections.crash
                }
                else
                n = connections.node1;


        try {
            // Take results from node 1 if available,
            // else take results from node 2 and 3 
            if(n.state !== 'disconnected') {
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
                
                if (i == 150)
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
    },
    crashNode1: function(req, res){
                        if (!n1crashed)
                            {console.log('<mainController> Crashing Node 1');}

                        else
                           console.log('<mainController> Restoring Node 1');
                    if(n1crashed == true)
                              n1crashed = false;
                              else
                              n1crashed = true;

                   },
          crashNode2: function(req, res){
                         if (!n2crashed)
                             console.log('<mainController> Crashing Node 2');

                         else
                            console.log('<mainController> Restoring Node 2');

                      if(n2crashed == true)
                                n2crashed = false;
                                else
                                n2crashed = true;


                 },
         crashNode3: function(req, res) {
                         if (!n3crashed)
                             console.log('<mainController> Crashing Node 3');

                         else
                            console.log('<mainController> Restoring Node 3');
                      if(n3crashed == true)
                                n3crashed = false;
                                else
                                n3crashed = true;
                  }
}

module.exports = controller;
