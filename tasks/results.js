const connection = require('../connection');
const {addNewUser, getUserByName} = require('./users.js');
const {getTaskName} = require('./helpers');

async function addResult(chatInfo) {
    const { chatId, senderName, words } = chatInfo;
    const taskName = await getTaskName(words);
    const score = words[words.length-1]; 

    if(/[a-zA-Z]/.test(score)) {
      return 'I see that in your score something wrong.'
    }
    const taskId = await getTaskIdByName(taskName, chatId);
    let user = await getUserByName(senderName, chatId);
  
    if(taskId !== undefined) {
        if(user === undefined) {
            await addNewUser(senderName, chatId);
            
            user = await getUserByName(senderName, chatId);
  
            await addNewResult(taskId.id, user.ID, score, chatId);
            return `${senderName} added score for <b>${taskName}</b> task!`
        } else {
            await addNewResult(taskId.id, user.ID, score, chatId);
            return `${senderName} added score for <b>${taskName}</b> task!`
        }
    } else {
        return `I cant add result for <b>${taskName}</b> as it is not in the list.` 
    }
  }

function addNewResult(taskId, userId, score, chatId) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO RESULTS (TaskID, UserID, Score, ChatID) VALUES (${taskId}, ${userId}, ${score}, ${chatId})`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
  
  function checkIfResultExist(chatId) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM RESULTS WHERE ChatID='${chatId}' ;`, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  function updateResult(taskId, userId, score, chatId) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE RESULTS SET Score=${score} WHERE TaskID='${taskId}' AND UserID='${userId}' AND ChatID='${chatId}'`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
  }

  function getTaskIdByName(name, chatId) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM TASKS WHERE Name='${name}' AND ChatID='${chatId}';`, (error, results) => {
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