const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getMovie: function(req, res) {
        var page_content = {
            name: 'Movie ' + req.params.id,
            year: (1950 + parseInt(req.params.id)),
            rank: ((0.5 * req.params.id) % 10 + 0.5),
            genres: [],
            directors: [],
            actors: []
        };

        for (var i = 0; i < 10; i++)
            page_content.genres.push('Genre ' + (i + 1));

        for (var i = 0; i < 5; i++)
            page_content.directors.push('Director ' + (i + 1));

        for (var i = 0; i < 25; i++) {
            var name = 'Actor ' + (i + 1);
            var role = 'Role ' + (i + 1);
            page_content.actors.push({name, role});
        }

        console.log(page_content);
        res.render('movie', page_content);
    }
}

module.exports = controller;