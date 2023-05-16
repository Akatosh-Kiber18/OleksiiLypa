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

async function addResult() {
const { chatId, senderName, words } = chatInfo;
const taskName = await getTaskName(words);
const userName = senderName;
const score = words[words.length-1]; 

const taskID = await connection.query(`SELECT ID FROM TASKS WHERE Name=${taskName};`)

if(taskID !== null) {
  const user = await connection.query(`SELECT * FROM USERS WHERE Name=${senderName};`);
  if(user===null) {
    await connection.query(`INSERT INTO USERS (Name) VALUES ('${senderName}')`);
  }
  await connection.query(`INSERT INTO RESULTS (TaskID, UserID, Score) VALUES ('${taskID}, ')`);
}

console.log(`Task info: ${taskID} \nUser info: ${user}`);
// INSERT INTO USERS ( Name)
// VALUES ('<user_name>');

// INSERT INTO RESULTS (TaskID, UserID, Score)
// VALUES (<task_id>, <user_id>, <score>);
}

async function addResult(chatInfo) {
  if (listOfTasks.hasOwnProperty(taskName)) {
      listOfTasks[taskName] = {[userName]: result};
      await bot.sendMessage(chatId, `Ok ${userName}, I add this low score to list.`);
  } else {
      await bot.sendMessage(chatId, `I dont see ${taskName} in the list, try to add it.`);
  }
}

async function getListOfTask() {
  const query = `SELECT * FROM TASKS`;
  await connection.query(query, async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(await parseListOfTasks(results));
    }
  })
}

async function parseListOfTasks(list) {
  if (list.length === 0) {
    return 'Hey, list of tasks is empty!!';
  }
  let message ='';
  const taskList = list.map(row => {
    return {
      NAME: row.NAME,
      USER: row.USER,
      RESULT: row.RESULT
    };
  });

  return message;
}

module.exports = {
  addTask,
  addResult,
  getListOfTask,
}