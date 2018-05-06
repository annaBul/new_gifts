var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gifts'
});

connection.connect();

module.exports.getConnetion = function getConnetion() {
    return connection;
}

// connection.query('SELECT * FROM gift', function(err, rows, fields) {
//   if (err) throw err;
//     console.log(rows);
// });


// connection.query('SELECT * FROM friend', function(err, rows, fields) {
//     if (err) throw err;
//       console.log(rows);
//   });

// connection.end();


// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT INTO favorites_for_friend (friend_id, gift_id) VALUES (1, 9)";
//     connection.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   });