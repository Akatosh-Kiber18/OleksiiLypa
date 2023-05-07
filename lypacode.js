const TelegramBot = require('node-telegram-bot-api');

// Replace YOUR_API_TOKEN with your Telegram bot's API token
const bot = new TelegramBot('TOKEN', { polling: true });

// Define a list of physical tasks to choose from
const tasks = [
    { name: "push-ups", count: 20 },
    { name: "pull-ups", count: 8 },
    { name: "squats", count: 30 },
    { name: "espander", count: 15 }
];

// const listOfTasks = { 
//     "pull-ups": {
//         "Oleksii1": "100",
//         "Oleksii2": "99"
//     }
// }

// Store user exercise counts in a Map
const exerciseCounts = new Map();

// Handle incoming messages
bot.on('message', (msg) => {
    // Get the chat ID and sender's name from the incoming message
    const chatId = msg.chat.id;
    const senderName = msg.from.first_name;
    
    // Split the incoming message into words
    const words = msg.text.split(' ');
    
    // If the message is in the format "/task count", where "task" is
    // the name of a physical task and "count" is a number, record
    // the user's exercise count for that task
    if (words.length === 2) {
        const taskName = words[0].toLowerCase();
        const count = parseInt(words[1]);
        
        const task = tasks.find(t => t.name === taskName);
        
        if (task && !isNaN(count)) {
            exerciseCounts.set(`${senderName}-${taskName}`, count);
            bot.sendMessage(chatId, `Thanks ${senderName}, I've recorded your result of ${count} ${taskName}`);
            return;
        }
    }
    
    // Choose a random task from the list
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    
    // Send the task to the user
    bot.sendMessage(chatId, `Hi ${senderName}, your physical task for today is: ${task.count} ${task.name}`);
});
