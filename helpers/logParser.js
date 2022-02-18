const logParser = {
    parseInsertValues: function(log) {
        var str = log.movie_id + ', ';
        str += '"' + log.name + '", ';
        str += log.year + ', ';
        str += log.rank + ', ';
        str += '"' + log.genre + '", ';
        str += '"' + log.director + '", ';
        str += '"' + log.actor1 + '", ';
        str += '"' + log.actor2 + '"';

        return str;
    },

    parseUpdateColumns: function(log) {
        var columns = [];
        
        columns.push('id');

        if(log.name != null)
            columns.push('name');

        if(log.year != null)
            columns.push('year');

        if(log.rank != null)
            columns.push('rank');

        if(log.genre != null)
            columns.push('genre');

        if(log.director != null)
            columns.push('director');

        if(log.actor1 != null)
            columns.push('actor1');

        if(log.actor2 != null)
            columns.push('actor2');

        return columns;
    },

    parseUpdateValues: function(log) {
        var values = [];
        
        values.push(log.movie_id);

        if(log.name != null)
            values.push('"' + log.name + '"');

        if(log.year != null)
            values.push(log.year);

        if(log.rank != null)
            values.push(log.rank);

        if(log.genre != null)
            values.push('"' + log.genre + '"');

        if(log.director != null)
            values.push('"' + log.director + '"');

        if(log.actor1 != null)
            values.push('"' + log.actor1 + '"');

        if(log.actor2 != null)
            values.push('"' + log.actor2 + '"');

        return values;
    }
};

module.exports = logParser;