var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname'); // change with a valid MYSQL connection string

module.exports = sequelize;

// var sequelize = new Sequelize('connectionUri', {
//   define: {
//     timestamps: false // true by default
//   }
// });

// var User = sequelize.define('user', {}); // timestamps is false by default
// var Post = sequelize.define('post', {}, {
//   timestamps: true // timestamps will now be true
// });