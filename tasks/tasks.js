const connection = require('../connection');
const {getTaskName, hasNonEnglishLetters} = require('./helpers.js');
const {checkIfResultExist} = require('./results');

async function addTask(chatInfo) {
  const { senderName, words } = chatInfo;
  let taskName = await getTaskName(words);
  if(hasNonEnglishLetters(taskName)){
      return `Please ${senderName} use English`
  }

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
  return `Ok ${senderName} I add <b>${taskName}</b> to list.`
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
  const reduceTasksData = res.reduce((acc, { TASK_NAME, USER_NAME, RESULT_SCORE }) => {
    if (!acc[TASK_NAME]) {
      acc[TASK_NAME] = {};
    }
    acc[TASK_NAME][USER_NAME] = RESULT_SCORE;
    return acc;
  }, []);
  
  const finalResult = Object.entries(reduceTasksData).map(([key, value]) => ({
    [key]: value
  }));
  
  return await prepareListForMessage(finalResult);
}

async function prepareListForMessage(list) {
  let message = '';
  
  list.forEach(task => {
    const key = Object.keys(task)[0];
    const value = task[key];
    
    message += `<b>${key}</b>:\n`;
    
    Object.entries(value).forEach(([user, score]) => {
      message += `${user}: ${score}\n`;
    });

    message += `\n`;
  });

  return message;
}

async function getListOfTasks() {
  const tasksExist = await checkIfTaskExist();
  const resultExist = await checkIfResultExist();
  if(tasksExist != undefined && resultExist != undefined) {
    try {
      const result = await getListOfTaskFromDB();
      const parsedData = await parseListOfTask(result);
      return parsedData;
    } catch (error) {
      console.error(error);
    }
  } else {
    return "List is empty"
  }
}

async function removeTask(chatData) {
  const { words } = chatData;
  const taskName = await getTaskName(words);
  const tasks = await checkIfTaskExist(taskName);
  let taskExist = false;
  tasks.forEach(task => {
    if(task.Name === taskName) {
      taskExist = true;
    }
  })
  if(taskExist) {
    try {
      await removeTaskResults(taskName);
      await removeTaskByName(taskName);
      
      return `<b>${taskName}</b> and scores for it removed`
    } catch (error) {
      return error
    }
  } else {
    return `I dont see this task in the list`
  }
}

function removeTaskResults(name) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM RESULTS WHERE TaskID IN (SELECT id FROM TASKS WHERE Name = '${name}');`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function removeTaskByName(name) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM TASKS WHERE Name = '${name}';`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function checkIfTaskExist() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM TASKS;`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  addTask,
  removeTask,
  getListOfTasks,
  checkIfTaskExist
}