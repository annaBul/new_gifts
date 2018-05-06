var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gifts',
  multipleStatements: true,
});

connection.connect();

module.exports.getConnetion = function getConnetion() {
    return connection;
}
