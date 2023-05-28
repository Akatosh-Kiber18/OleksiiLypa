const connection = require('../connection');

function getUserByName(name, chatId) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT ID FROM USERS WHERE Name='${name}' AND ChatID='${chatId}';`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
  function addNewUser(name, chatId) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO USERS (NAME, ChatID) VALUES ('${name}', ${chatId});`, (error, results) => {
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