var User = require("./model");
var mongoose = require("mongoose");
const Discord = require("discord.js");
const { mongodbConnection } = require("../../config.json");

mongoose.connect(
  mongodbConnection,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err) {
    if (err) return console.log(err);
    console.log("connected");
  }
);

function userCheck(ID, cb) {
  User.find({ discordID: ID }, function (err, docs) {
    if (docs.length) {
      cb("User exist", null);
    } else cb();
  });
}

function addUser(message, client, user) {
  const ID = user[0] ? getUserFromMention(user[0], client) : message.member.id;
  // console.log(ID)
  userCheck(ID, function (err, user) {
    if (err || user) {
      client.users.fetch(ID).then((myUser) => {
        const Embed = new Discord.MessageEmbed()
          .setColor("FF009A")
          .setThumbnail(myUser.avatarURL())
          .setTitle(myUser.username)
          .setDescription("The user has already been registered.")
          .setFooter("© PipoBot", client.user.displayAvatarURL());
        message.channel.send(Embed);
      });
      return;
    } else {
      var userData = {
        discordID: ID,
        count: 0,
        registrationDate: new Date(),
      };

      var newUser = new User(userData);

      newUser.save();
      client.users.fetch(ID).then((myUser) => {
        const Embed = new Discord.MessageEmbed()
          .setColor("FF009A")
          .setThumbnail(myUser.avatarURL())
          .setTitle(myUser.username)
          .setDescription("The user has been successfully registered.")
          .setFooter("© PipoBot", client.user.displayAvatarURL());
        message.channel.send(Embed);
      });
      return;
    }
  });
}

function getUserFromMention(mention, client) {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention).id;
  }
}

function getRandomUser(message, client) {
  User.countDocuments().exec(function (err, count) {
    var random = Math.floor(Math.random() * count);

    User.findOne()
      .skip(random)
      .exec(function (err, result) {
        //   console.log(result);
        result.count += 1;
        result.save();
        client.users.fetch(result.discordID).then((myUser) => {
          const Embed = new Discord.MessageEmbed()
            .setColor("FF009A")
            .setTitle(myUser.username)
            .setThumbnail(myUser.avatarURL())
            .setDescription(`You've been chosen **${result.count}** times.`)
            .addFields({
              name: "Registration date:",
              value: result.registrationDate.toString().split("GMT")[0],
            })
            .setFooter("© PipoBot", client.user.displayAvatarURL());
          message.channel.send(Embed);
        });
        return;
      });
  });
  return;
}

function getMyStats(message, client) {
  const ID = message.member.id;
  User.findOne({ discordID: ID }, function (err, stats) {
    // console.log(stats)
    if (err || !stats) {
      console.log(err);
      message.channel.send(
        `You haven't been registered yet. Please type **!register**`
      );
      return;
    } else {
      const Embed = new Discord.MessageEmbed()
        .setColor("FF009A")
        .setThumbnail(message.author.avatarURL())
        .setTitle(message.author.username)
        .setDescription(`You've been chosen **${stats.count}** times.`)
        .addFields({
          name: "Date of registration:",
          value: stats.registrationDate.toString().split("GMT")[0],
        })
        .setFooter("© PipoBot", client.user.displayAvatarURL());
      message.channel.send(Embed);
      return;
    }
  });
}

function getStats(message, client) {
  User.find({}, async function (err, users) {
    if (err || !users) {
      console.log(err);
      message.channel.send("Error has occured!");
      return;
    } else {
      var top =
        users.length > 5
          ? users.sort((a, b) => b.count - a.count).splice(5)
          : users.sort((a, b) => b.count - a.count);
      const Embed = new Discord.MessageEmbed()
        .setColor("FF009A")
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setTitle("Top 5")
        .setTimestamp(new Date())
        .setFooter("© PipoBot", client.user.displayAvatarURL());
      for (user of top) {
        await client.users.fetch(user.discordID).then((myUser) => {
          return Embed.addField(myUser.username, `${user.count} times`);
        });
      }
      message.channel.send(Embed);
      return;
    }
  });
}

class DataBase {
  static addUser(message, client, user) {
    addUser(message, client, user);
  }
  static getRandomUser(message, client) {
    getRandomUser(message, client);
  }
  static getMyStats(message, client) {
    getMyStats(message, client);
  }
  static getStats(message, client) {
    getStats(message, client);
  }
}

module.exports = { DataBase };
