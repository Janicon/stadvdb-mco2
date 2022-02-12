const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getIndex: function(req, res) {
        var page_content = {
            actorIds: [],
            directorIds: [],
            movieIds: []
        }

        for (var i = 0; i < 50; i++) {
            var name = 'Actor ' + (i + 1);
            var id = '000' + (i + 1);
            page_content.actorIds.push({name, id});
        }

        for (var i = 0; i < 50; i++) {
            var name = 'Director ' + (i + 1);
            var id = '000' + (i + 1);
            page_content.directorIds.push({name, id});
        }

        for (var i = 0; i < 50; i++) {
            var name = 'Movie ' + (i + 1);
            var id = '000' + (i + 1);
            page_content.movieIds.push({name, id});
        }

        res.render('index', page_content);
    }
}

module.exports = controller;
