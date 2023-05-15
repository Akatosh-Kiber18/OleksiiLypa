const connection = require('../connection');
const {getTaskName} = require('./helpers.js');

async function addTask(chatInfo) {
  const { senderName, words } = chatInfo;
  let taskName = await getTaskName(words);

  if(taskName == undefined) {
    return `I don't think that is the correct name for the task`;
  }

  try {
    const query = `INSERT INTO TASKS (NAME, USER) VALUES ('${taskName}', '${senderName}')`;
    await connection.query(query);
    console.log('Task inserted successfully!');
  } 
  catch (error) {
    console.error('Error occurred while inserting the task:', error);
  }
  return `Ok ${senderName} I add ${taskName} to list.`
}

//Make it work with one task and alot of users from the same table
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
  getListOfTask
}