const Discord = require('discord.js');

function help(channel, client){
    const em = "<:babyyoda:758925553759420416>"
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('FF009A')
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setTitle(`Hey! How it's going? Try out these commands ${em}`)
        .setDescription("(This is a **Beta** version)")
        .addFields(
            {name: 'pp!gif', value: "sends back a random gif"},
            {name: 'pp!gif *tag*', value: "sends back a random gif based on your tag"},
            {name: 'pp!getvid *queue*', value: "find an YT video by your queue"}
            // {name: 'pp!command3', value: "what id does"},
        )
        .setTimestamp(new Date())
        .setFooter("© CharlesUwU", client.user.displayAvatarURL())

    channel.send(helpEmbed)
}

module.exports = {help}
