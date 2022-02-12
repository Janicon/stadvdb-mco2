const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getDirector: function(req, res) {
        var page_content = {
            fname: 'Director ',
            lname: req.params.id,
            genres: [],
            movies: []
        };

        for (var i = 0; i < 10; i++) {
            var genre = 'Genre ' + (i + 1);
            var prob = '' + (((10 * (1 + 1)) % 100) + 1) + '%';
            page_content.genres.push({genre, prob});
        }

        for (var i = 0; i < 50; i++) {
            var movie = 'Movie ' + (i + 1);
            page_content.movies.push(movie);
        }

        console.log(page_content);
        res.render('director', page_content);
    }
}

module.exports = controller;
