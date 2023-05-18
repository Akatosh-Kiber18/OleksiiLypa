const connection = require('../connection');
const {getTaskName} = require('./helpers.js');

async function addTask(chatInfo) {
  const { senderName, words } = chatInfo;
  let taskName = await getTaskName(words);

  if(taskName == undefined) {
    return `I don't think that is the correct name for the task`;
  }

  try {
    const query = `INSERT INTO TASKS (NAME) VALUES ('${taskName}')`;
    await connection.query(query);

    console.log('Task inserted successfully!');
  } 
  catch (error) {
    console.error('Error occurred while inserting the task:', error);
  }
  return `Ok ${senderName} I add ${taskName} to list.`
}

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
          return `${senderName} added score for ${taskName} task!`
      } else {
          await updateResult(taskId.id, user.ID, score);
          return `${senderName} changed score for ${taskName} task!`
      }
  } else {
      return `I cant add result for ${taskName} as it is not in the list.` 
  }
}

async function removeTask(chatData) {
  // const { chatId, senderName, words } = chatData;
  // taskName = await getTaskName(words);
}

async function getListOfTask() {
  try {
    const query = `
      SELECT TASKS.Name AS TASK_NAME, USERS.Name AS USER_NAME, RESULTS.Score AS RESULT_SCORE
      FROM RESULTS
      JOIN TASKS ON RESULTS.TaskID = TASKS.id
      JOIN USERS ON RESULTS.UserID = USERS.id;
    `;
    const [rows] = await connection.query(query);

    if (!rows || !Array.isArray(rows)) {
      console.log('No data found.');
      return;
    }

    const data = rows.map(row => ({
      NAME: row.TASK_NAME,
      USER: row.USER_NAME,
      RESULT: row.RESULT_SCORE
    }));

    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

//Actually it is will not remove as RESULTS table hs FK UserID to
function removeTaskByName(name) {
// -- Delete the results first
// DELETE FROM RESULTS WHERE TaskID IN (SELECT id FROM TASKS WHERE Name = '<task_name>');
}

function removeTaskResults(taskId) {
// -- Delete the task
// DELETE FROM TASKS WHERE Name = '<task_name>';
}

function getTaskIdByName(name) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM TASKS WHERE Name='${name}';`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

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
  addTask,
  addResult,
  removeTask,
  getListOfTask
}