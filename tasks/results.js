const connection = require('../connection');
const {addNewUser, getUserByName} = require('./users.js');
const {getTaskIdByName} = require('./tasks');
const {getTaskName} = require('./helpers');

async function addResult(chatInfo) {
    const { senderName, words } = chatInfo;
    const taskName = await getTaskName(words);
    const score = words[words.length-1]; 
  
    const taskId = await getTaskIdByName(taskName);
    let user = await getUserByName(senderName);
  
    if(taskId !== undefined) {
        if(user === undefined) {
            await addNewUser(senderName);
            
            user = await getUserByName(senderName);
  
            await addNewResult(taskId.id, user.ID, score);
            return `${senderName} added score for <b>${taskName}</b> task!`
        } else {
            await addNewResult(taskId.id, user.ID, score);
            return `${senderName} added score for <b>${taskName}</b> task!`
        }
    } else {
        return `I cant add result for <b>${taskName}</b> as it is not in the list.` 
    }
  }

function addNewResult(taskId, userId, score) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO RESULTS (TaskID, UserID, Score) VALUES (${taskId}, ${userId}, ${score})`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
  function checkIfResultExist() {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM RESULTS;`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  function updateResult(taskId, userId, score) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE RESULTS SET Score=${score} WHERE TaskID='${taskId}' AND UserID='${userId}'`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
  }

module.exports = {
    addResult,
    checkIfResultExist
}