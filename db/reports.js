
// number of movies per genre
genreCountMovies: async(conn, tablename) => {
        var result;
        return new Promise((resolve, reject) => {
            conn('START TRANSACTION')
            .then((res) => {
                console.log('<db.genreCountMovies> Starting transaction');
                return conn('SELECT GENRE, COUNT(*) AS NUM_MOVIES FROM ' + tablename
                            + ' GROUP BY GENRE ORDER BY NUM_MOVIES DESC FOR SHARE');
            })
            .then((res) => {
                result = res;
                console.log('<db.genreCountMovies> Found ' + result.length + ' row(s)');
                return conn('COMMIT')
            })
            .then((res) => {
                console.log('<db.genreCountMovies> Committing transaction');
                return resolve(result);
            })
            .catch((err) => {
                console.error('<db.genreCountMovies> Error - ', err);
                return reject(err);
            });
        });
 },

//Ranking of genres by rating
 genreAvgRank: async(conn, tablename) => {
         var result;
         return new Promise((resolve, reject) => {
             conn('START TRANSACTION')
             .then((res) => {
                 console.log('<db.getGenreAvgRank> Starting transaction');
                 return conn('SELECT GENRE, ROUND(AVG(`rank`),2) AS AVG_RANK FROM ' + tablename +
                             ' GROUP BY GENRE ORDER BY AVG_RANK DESC FOR SHARE');
             })
             .then((res) => {
                 result = res;
                 console.log('<db.getGenreAvgRank> Found ' + result.length + ' row(s)');
                 return conn('COMMIT')
             })
             .then((res) => {
                 console.log('<db.getGenreAvgRank> Committing transaction');
                 return resolve(result);
             })
             .catch((err) => {
                 console.error('<db.getGenreAvgRank> Error - ', err);
                 return reject(err);
             });
         });
  },

//Number of movies per director in descending order, up to 100 rows
   directorCountMovies: async(conn, tablename) => {
          var result;
          return new Promise((resolve, reject) => {
              conn('START TRANSACTION')
              .then((res) => {
                  console.log('<db.directorCountMovies> Starting transaction');
                  return conn('SELECT DIRECTOR, COUNT(*) AS NUM_MOVIES FROM ' + tablename
                                + ' GROUP BY DIRECTOR ORDER BY NUM_MOVIES DESC LIMIT 100 FOR SHARE');
              })
              .then((res) => {
                  result = res;
                  console.log('<db.directorCountMovies> Found ' + result.length + ' row(s)');
                  return conn('COMMIT')
              })
              .then((res) => {
                  console.log('<db.directorCountMovies> Committing transaction');
                  return resolve(result);
              })
              .catch((err) => {
                  console.error('<db.directorCountMovies> Error - ', err);
                  return reject(err);
              });
          });
   },

// number of movies per actor in descending order, up to 100 rows
   actorCountMovies: async(conn, tablename) => {
         var result;
         return new Promise((resolve, reject) => {
             conn('START TRANSACTION')
             .then((res) => {
                 console.log('<db.actorCountMovies> Starting transaction');
                 return conn('SELECT ACTOR1, COUNT(*) AS NUM_MOVIES FROM ' + tablename
                               + ' GROUP BY ACTOR1 ORDER BY NUM_MOVIES DESC LIMIT 100 FOR SHARE');
             })
             .then((res) => {
                 result = res;
                 console.log('<db.actorCountMovies> Found ' + result.length + ' row(s)');
                 return conn('COMMIT')
             })
             .then((res) => {
                 console.log('<db.actorCountMovies> Committing transaction');
                 return resolve(result);
             })
             .catch((err) => {
                 console.error('<db.actorCountMovies> Error - ', err);
                 return reject(err);
             });
         });
  }