const connection = require('../connection');

function getUserByName(name) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT ID FROM USERS WHERE Name='${name}';`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
  function addNewUser(name) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO USERS (NAME) VALUES ('${name}');`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  module.exports = {
    addNewUser,
    getUserByName
  }