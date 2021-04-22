const { help } = require("./commands/core/help");
const { giphy } = require("./commands/entertainment/gif/giphy");
const { getVideo } = require("./commands/entertainment/music/youtube");
const { newMember } = require("./commands/userManagement/newMember");
const { setRole } = require("./commands/userManagement/setRole");
const {
  sendWeatherForecastEmbed,
} = require("./commands/entertainment/weather/weather");
const { DataBase } = require("./commands/database/index");
const { Player } = require("./commands/entertainment/music/index");

const {
  setVakbyan,
  vyakBanWatcher,
} = require("./commands/core/vyakBanHandler");

const Discord = require("discord.js");
const client = new Discord.Client();

const { prefix, token } = require("./config.json");

client.once("ready", () => {
  client.user.setActivity(prefix + "help", { type: "LISTENING" });
  console.log("Ready!");
  vyakBanWatcher(client);
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("guildMemberAdd", (member) => {
  newMember(client, member);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const split = message.content.slice(prefix.length).trim().split(/ +/);
  const command = split.shift().toLowerCase();
  const userMention = split.slice(0);

  switch (command) {
    case "help":
      help(message.channel, client);
      break;
    case "gif":
      giphy(message.channel, split);
      break;
    case "getvid":
      getVideo(message.channel, split);
      break;
    case "play":
      Player.play(message);
      break;
    case "skip":
      Player.skip(message);
      break;
    case "stop":
      Player.stop(message);
      break;
    case "setrole":
      setRole(message);
      break;
    case "weather":
      sendWeatherForecastEmbed(message);
      break;
    case "register":
      DataBase.addUser(message, client, userMention);
      break;
    case "random":
      DataBase.getRandomUser(message, client);
      break;
    case "mystats":
      DataBase.getMyStats(message, client);
      break;
    case "top":
      DataBase.getStats(message, client);
      break;
    case "vyak":
      setVakbyan(client, message, userMention);
      break;
    default:
      message.channel.send(
        "Wrong command, type pp!help to see available commands."
      );
  }
});

client.login(token);
