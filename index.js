const { help } = require("./commands/core/help");
const { giphy } = require("./commands/giphy");
const { get_video } = require("./commands/music/youtube");
const { newMember } = require("./commands/userManagement/newMember");
const { asyncExecute, skip, stop } = require("./commands/music/player");
const { setRole } = require("./commands/userManagement/setRole");

const Discord = require('discord.js');
const client = new Discord.Client();

const {
	prefix,
    token,
} = require('./config.json');

client.once('ready', () => {                                            
    client.user.setActivity(prefix + "help", { type: "LISTENING"})                  
    console.log('Ready!');
   });
   client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
   client.once('disconnect', () => {
    console.log('Disconnect!');
});


client.on('guildMemberAdd', member => {
    newMember(client, member)
});


client.on('message', async message => {                                       
    if(!message.content.startsWith(prefix) || message.author.bot) return; 
                                                              
    const split = message.content.slice(prefix.length).trim().split(/ +/);
    const command = split.shift().toLowerCase();

    switch (command) {

        case 'help':
            help(message.channel, client);
            break;
        case "gif":
            giphy(message.channel, split);
            break;
        case "getvid":
            get_video(message.channel, split);
            break;
        case "play":
            asyncExecute(message);
            break;
        case "skip":
            skip(message);
            break;
        case "stop":
            stop(message);
            break;
        case "setrole":
            setRole(message);
            break;
        default:
            message.channel.send('Wrong command, type pp!help to see available commands.')

    }
})

client.login(token);