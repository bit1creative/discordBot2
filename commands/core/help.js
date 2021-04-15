const Discord = require("discord.js");

function help(channel, client) {
  const em = "<:babyyoda:758925553759420416>";
  const helpEmbed = new Discord.MessageEmbed()
    .setColor("FF009A")
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setTitle(`Hey! How it's going? Try out these commands ${em}`)
    .setDescription("(This is a **Beta** version)")
    .addFields(
      { name: "pp!gif", value: "sends back a random gif" },
      {
        name: "pp!gif *tag*",
        value: "sends back a random gif based on your tag",
      },
      {
        name: "pp!getvid *key_words*",
        value: "find an YT video by your key words",
      },
      { name: "pp!play *video_name / url*", value: "play song" },
      { name: "pp!skip", value: "skip song" },
      { name: "pp!stop", value: "stop playing" },
      {
        name: "pp!weather *city*",
        value: "get a 5 days weather forecast for your city",
      },
      { name: "!register", value: "Use to register" },
      { name: "!random", value: "Use to choose a random user from registered" },
      { name: "!mystats", value: "View your stats" },
      { name: "!top", value: "Top 5 most frequently chosen users" }
      // {name: 'pp!command3', value: "what id does"},
    )
    .setTimestamp(new Date())
    .setFooter("© CharlesUwU", client.user.displayAvatarURL());

  channel.send(helpEmbed);
}

module.exports = { help };
