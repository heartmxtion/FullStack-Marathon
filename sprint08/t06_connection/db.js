const mysql = require('mysql2');
const config = require('./config.json');

const pool = mysql.createPool(config);

pool.query('SELECT * FROM heroes', (error, results) => {
  if (error) {
    console.error('Error executing query:', error);
    return;
  }
  console.log('Query results:', results);
});
