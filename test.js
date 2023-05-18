const connection = require('./connection');
const {getTaskName} = require('./tasks/helpers');

const testInfo = {
    senderName: "Oleksii Golovniak",
    words: ["/addresult", "TestName", "20"]
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

  async function getListOfTaskFromDB() {
    return new Promise((resolve, reject) => {  
      const query = `
        SELECT TASKS.Name AS TASK_NAME, USERS.Name AS USER_NAME, RESULTS.Score AS RESULT_SCORE
        FROM RESULTS
        JOIN TASKS ON RESULTS.TaskID = TASKS.id
        JOIN USERS ON RESULTS.UserID = USERS.id;
      `;
      connection.query(query, (error, results) => {
        if(error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    })
  }

  async function parseListOfTask(res) {
    const data = res.map(row => ({
      NAME: row.TASK_NAME,
      USER: row.USER_NAME,
      RESULT: row.RESULT_SCORE
    }));

    return data;
  }
  
  async function getData() {
    try {
      const result = await getListOfTaskFromDB();
      const parsedData = await parseListOfTask(result);
      console.log(parsedData);
      return parsedData;
    } catch (error) {
      console.error(error);
    }
  }
  
  getData();