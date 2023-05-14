const connection = require('../connection');

connection.query('SELECT * FROM TASKS', (error, results, fields) => {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
});