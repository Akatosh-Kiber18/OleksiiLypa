require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const {addTask, getListOfTasks, removeTask} = require('./tasks/tasks.js');
const {addResult} = require('./tasks/results.js');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.setMyCommands([
    {command: '/help', description: 'Show command list'},
    {command: '/tasklist', description: 'Showing task list'},
    {command: '/addtask', description: 'Add task by name'},
    {command: '/removetask', description: 'Remove task by name'},
    {command: '/addresult', description: 'Add result by task name'},
    {command: '/leaderboard', description: 'Showing leader board by task name'}
])

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
    chatData = {
        chatId: msg.chat.id,
        senderName: msg.from.first_name + " " + msg.from.last_name,
        words: msg.text.split(' ')      
    }

    commandList(chatData)
});


async function commandList (chatData) {
    const { chatId, senderName, words } = chatData;

    switch (words[0]) {
        case '/help':
           await help(chatData);
        break;
        
        case '/addtask':
            await bot.sendMessage(chatId, await addTask(chatData), { parse_mode: 'HTML' });
        break;

        case '/removetask':
            await bot.sendMessage(chatId, await removeTask(chatData), { parse_mode: 'HTML' });   
        break;

        case '/addresult':
            await bot.sendMessage(chatId, await addResult(chatData), { parse_mode: 'HTML' });     
        break;

        case '/leaderboard':
            await bot.sendMessage(chatId, await leaderboard(chatData));     
        break;

        case '/tasklist':
            await bot.sendMessage(chatId, await getListOfTasks(chatData), { parse_mode: 'HTML' });
        break;

        default : {
            await bot.sendMessage(chatId, `Hi ${senderName}, maybe you should use /help?`);
        break;    
        }
   }
}

async function help (chatData) {
    const { chatId } = chatData;
    let result = '';
    for(const item of helpList) {
       result += `${item.name} - ${item.value}\n\n`; 
    }
    await bot.sendMessage(chatId, result);
}

async function leaderboard(chatData) {
    const { chatId, senderName, words } = chatData;
    return 'not implemented yet'
}