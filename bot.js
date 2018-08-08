const Discord = require('discord.js-commando');
const bot = new Discord.Client({
    commandPrefix: '$'
    });
const auth = require('./auth.json');

bot.registry.registerGroup('simple', 'Simple');
bot.registry.registerGroup('music', 'Music');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + '/commands');

global.servers = {};

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.login(auth.token);