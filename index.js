require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
bot.setMyCommands([
    {command: '/help', description: 'Show command list'},
    {command: '/tasklist', description: 'Showing task list'}
])
let listOfTasks = {};
const helpList = [
    {
        name: '/addtask',
        value: 'Adding new task. \nExample: /addtask pull-ups'
    },
    {
        name: '/removetask',
        value: 'Removing task by name. \nExample: /removetask pull-ups'
    },
    {
        name: '/addresult',
        value: 'Adding result by task name depend on user. \nExample: /addresult pull-ups 10'
    },
    {
        name: '/leaderboard',
        value: 'Show leaderboar by task name. \nExample: /leaderboard pull-ups'
    },
    {
        name: '/tasklist',
        value: 'Showing task list'
    }
];

bot.on('message', async (msg) => {    
    chatInfo = {
        chatId: msg.chat.id,
        senderName: msg.from.first_name,
        words: msg.text.split(' ')      
    }

    commandList(chatInfo)
});


async function commandList (chatInfo) {
    const { chatId, senderName, words } = chatInfo;

    switch (words[0]) {
        case '/help':
           await help(chatInfo);
        break;
        
        case '/addtask':
           await addTask(chatInfo);
        break;

        case '/removetask':
           await removeTask(chatInfo);     
        break;

        case '/addresult':
           await addResult(chatInfo);     
        break;

        case '/leaderboard':
           await leaderboard(chatInfo);     
        break;

        case '/tasklist':
           const list = await getListOfTask();
           await bot.sendMessage(chatId, list);
        break;

        default : {
            await bot.sendMessage(chatId, `Hi ${senderName}, maybe you should use /help?`);
        break;    
        }
   }
}

async function help (chatInfo) {
    const { chatId } = chatInfo;
    let result = '';
    for(const item of helpList) {
       result += `${item.name} - ${item.value}\n\n`; 
    }
    await bot.sendMessage(chatId, result);
}

async function addTask(chatInfo) {
    const { chatId, senderName, words } = chatInfo;
    let taskName = await getTaskName(words);

    listOfTasks[taskName] = {};
    
    await bot.sendMessage(chatId, `Ok ${senderName} I add ${taskName} to list`)
}

async function removeTask(chatInfo) {
    const { chatId, senderName, words } = chatInfo;
    taskName = await getTaskName(words);

    delete listOfTasks[taskName];
    await bot.sendMessage(chatId, `Ok ${senderName} I remove ${taskName} from list`)
}

async function addResult(chatInfo) {
    const { chatId, senderName, words } = chatInfo;
}

async function leaderboard(chatInfo) {
    const { chatId, senderName, words } = chatInfo;
}

async function getListOfTask() {
    if (Object.keys(listOfTasks).length === 0) {
      return 'Hey, list of tasks is empty!!';
    }
    let taskList = '';
    Object.keys(listOfTasks).forEach((task) => {
      const taskObj = listOfTasks[task];
      let userList = '';
      if (Object.keys(taskObj).length === 0) {
        userList = 'No users found';
      } else {
        Object.keys(taskObj).forEach((user) => {
          userList += `${user}: ${taskObj[user]}\n`;
        });
      }
      taskList += `${task}: \n${userList}\n`;
    });
    return taskList;
  }

async function getTaskName (words) {
    let taskName = ''
    if(words.length > 1) {
        for (let i = 1; i < words.length; i++) {
            taskName += " " + words[i];
        }
    } else if (words.length === 1){
            taskName = words[0];
    } else {
        return;
    }

    return taskName.trim();
}   