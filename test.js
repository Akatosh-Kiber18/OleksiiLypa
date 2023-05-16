const connection = require('./connection');
const {getTaskName} = require('./tasks/helpers');

const testInfo = {
    senderName: "Oleksii Golovniak",
    words: ["/addtask", "TestName", "15"]
}

async function addResult(chatInfo) {
    const { senderName, words } = chatInfo;
    const taskName = await getTaskName(words);
    const score = words[words.length-1]; 

    const taskId = await getTaskIdByName(taskName);
    let user = await getUserByName(senderName);
    // console.log(user);

    if(taskId !== undefined) {
        if(user === undefined) {
            await addNewUser(senderName);
            user = await getUserByName(senderName);
        }
            await addNewResult(taskId.id, user.ID, score);
    } else {
        return 'uuups something went wrong =D' 
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



    addResult(testInfo);