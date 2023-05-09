require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
bot.setMyCommands([
    {command: '/help', description: 'Show command list'}
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
    }
];

bot.on('message', async (msg) => {
    console.log('Received message:', msg);
    const chatId = msg.chat.id;
    // const senderName = msg.from.first_name;

    const words = msg.text.split(' ');
    if(words[0] === "/help") {
        let result = '';
        for(const item of helpList) {
           result += `${item.name} - ${item.value}\n\n`; 
        }
        await bot.sendMessage(chatId, result);
    } 
});


// async function commandList (words, senderName, chatId) {
//     switch (words[0]) {
//         case '/addtask':
//             if(words.length<1) {
//                 await bot.sendMessage(chatId, `Hi ${senderName}, you need to write task name e.g /addtask pull-ups`);
//             } else {
//                 const taskName = words[1].toLowerCase();
//                 listOfTasks[taskName] = {};  
//                 await bot.sendMessage(chatId, `Hi ${senderName}, you add new task: ${taskName}`);
//             }
//         break;
        
//         default : {
//             await bot.sendMessage(chatId, `Hi ${senderName}, for more information use /help`);
//         break;    
//         }
//    }
// }
