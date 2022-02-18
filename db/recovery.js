const db = require('./dbNoCrash.js');
const connections = require('./connections.js');
const logParser = require('../helpers/logParser.js');

const recovery = {
    recoverPrimary: async(req, res) => {
        // TODO: Change this to [if node 1 is disconnected]
        if(true) {
            var latestLogQuery = 'SELECT * FROM logs ORDER BY log_id DESC LIMIT 1 FOR SHARE';
            var getNewLogsQuery = 'SELECT * FROM logs ' // Append WHERE, ORDER BY, FOR SHARE

            // Get latest log of primary node0
            var primary = await db.query(connections.node1p, latestLogQuery);
            
            // Prepare query to get all logs after last log in node 1
            var logDate = primary[0].date;
            logDate.setTime(logDate.getTime() + (8*60*60*1000));
            logDate = new Date(logDate).toISOString().slice(0, 19).replace('T', ' ');
            getNewLogsQuery += 'WHERE date >= "' + logDate + '"';
            getNewLogsQuery += ' ORDER BY log_id ASC FOR SHARE';

            // Get logs that are in node 2 but not in primary node
            var loglist = await db.query(connections.node2p, getNewLogsQuery);

            // Get logs that are in node 3 but not in primary node
            loglist = loglist.concat(await db.query(connections.node3p, getNewLogsQuery));

            // For retrieved logs, replicate the transactions
            for(var i in loglist) {
                // If log states that transaction was not committed, skip log
                if(loglist[i].committed == 0)
                    continue;
                
                // Get which log record to modify
                var targetLogCondition = 'date="'
                    + new Date(loglist[i].date).toISOString().slice(0, 19).replace('T', ' ')
                    + '"';
                
                // Replicate the transactions
                switch(loglist[i].operation) {
                    case 'INSERT':
                        console.log('<Recovery> Performing INSERT on movie with id=' + loglist[i].movie_id);
                        var values = logParser.parseInsertValues(loglist[i]);
                        await db.insert(connections.node1p, 'den_imdb', values);
                        await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], targetLogCondition);
                        break;
                    case 'UPDATE':
                        console.log('<Recovery> Performing UPDATE on movie with id=' + loglist[i].movie_id);
                        var columns = logParser.parseUpdateColumns(loglist[i]);
                        var values = logParser.parseUpdateValues(loglist[i]);
                        await db.update(connections.node1p, 'den_imdb', columns, values, ('id=' + loglist[i].movie_id));
                        await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], targetLogCondition);
                        break;
                    case 'DELETE':
                        console.log('<Recovery> Performing DELETE on movie with id=' + loglist[i].movie_id);
                        var id = loglist[i].movie_id;
                        await db.delete(connections.node1p, 'den_imdb', ('id=' + id));
                        await db.update(connections.node1p, 'logs', ['committed'], ['TRUE'], targetLogCondition);
                        break;
                    default:
                        console.log('<Recovery> Log contains invalid operation');
                }
            }
        }
    },
    
    recoverSecondary: async(node) => {
        console.log(node);
        var latestLogQuery = 'SELECT * FROM logs ORDER BY log_id DESC LIMIT 1 FOR SHARE';
        var getNewLogsQuery = 'SELECT * FROM logs ' // Append WHERE, ORDER BY, FOR SHARE
        var targetNode;
        
        if(node = 'Node 2')
            targetNode = connections.node2p;
        else
            targetNode = connections.node3p;

        // Get latest log of secondary node
        var secondary = await db.query(targetNode, latestLogQuery);
        
        // Prepare query to get all logs after last log in secondary node
        var logDate = secondary[0].date;
        logDate.setTime(logDate.getTime() + (8*60*60*1000));
        logDate = new Date(logDate).toISOString().slice(0, 19).replace('T', ' ');
        getNewLogsQuery += 'WHERE date >= "' + logDate + '"';
        getNewLogsQuery += ' ORDER BY log_id ASC FOR SHARE';

        // Get logs that are in node 1 but not in secondary node
        var loglist = await db.query(connections.node1p, getNewLogsQuery);

        // For retrieved logs, replicate the transactions
        for(var i in loglist) {                
            // If log states that transaction was not committed, skip
            if(loglist[i].committed == 0)
                continue;
            
            // If restoring node 2 and restoring movie <= 1980
            if(targetNode == connections.node2p && loglist[i].year >= 1980)
                continue;
            else if(targetNode == connections.node3p && loglist[i].year < 1980)
                continue;
            
            console.log('Log ' + loglist[i].log_id + ': recovering');
            
            // Get which log record to modify
            var targetLogCondition = 'date="'
                + new Date(loglist[i].date).toISOString().slice(0, 19).replace('T', ' ')
                + '"';
            
            // Replicate the transactions
            switch(loglist[i].operation) {
                case 'INSERT':
                    console.log('<Recovery> Performing INSERT on movie with id=' + loglist[i].movie_id);
                    var values = logParser.parseInsertValues(loglist[i]);
                    await db.insert(targetNode, 'den_imdb', values);
                    await db.update(targetNode, 'logs', ['committed'], ['TRUE'], targetLogCondition);
                    break;
                case 'UPDATE':
                    console.log('<Recovery> Performing UPDATE on movie with id=' + loglist[i].movie_id);
                    var columns = logParser.parseUpdateColumns(loglist[i]);
                    var values = logParser.parseUpdateValues(loglist[i]);
                    await db.update(targetNode, 'den_imdb', columns, values, ('id=' + loglist[i].movie_id));
                    await db.update(targetNode, 'logs', ['committed'], ['TRUE'], targetLogCondition);
                    break;
                case 'DELETE':
                    console.log('<Recovery> Performing DELETE on movie with id=' + loglist[i].movie_id);
                    var id = loglist[i].movie_id;
                    await db.delete(targetNode, 'den_imdb', ('id=' + id));
                    await db.update(targetNode, 'logs', ['committed'], ['TRUE'], targetLogCondition);
                    break;
                default:
                    console.log('<Recovery> Log contains invalid operation');
            }
        }
    }
}

module.exports = recovery;