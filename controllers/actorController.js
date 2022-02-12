const controller = {
    getFavicon: function (req, res) {
        res.status(204);
    },

    getActor: function(req, res) {
        var page_content = {
            fname: 'Actor ',
            lname: req.params.id,
            gender: 'LGTV OLED HD',
            roles: []
        };

        for (var i = 0; i < 25; i++) {
            var movie = 'Movie ' + (i + 1);
            var role = 'Role ' + (i + 1);
            page_content.roles.push ({movie, role});
        }

        res.render('actor', page_content);
    }
}

module.exports = controller;