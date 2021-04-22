const {
  vyakbanChannelId,
  vyakbanRoleId,
  guildId,
} = require("../../config.json");
const moment = require("moment");
const schedule = require("node-schedule");

const setVakbyan = async (client, message, user) => {
  message.delete({ timeout: 10000 });
  if (!user[0]) return;
  const channel = client.channels.cache.get(vyakbanChannelId);
  const pinnedMessages = channel.messages.fetchPinned();
  const userInfo = getUserInfoFromMention(user[0], client);
  if (!userInfo) return;
  //   console.log(userInfo);
  const needToSendEmbed =
    (await pinnedMessages.then(async (collection) => collection.size)) === 0;
  if (!needToSendEmbed) {
    // const embed = channel.messages.cache.get(
    //   await pinnedMessages.then(
    //     async (collection) => Array.from(collection.keys())[0]
    //   )
    // );
    const vyakBanEmbedMsg = await pinnedMessages.then(
      async (collection) => Array.from(collection.entries())[0][1]
    );
    const vyakBanEmbed = vyakBanEmbedMsg.embeds[0];
    // embed.embeds[0].fields.forEach((user) => if(user.name === userInfo.name){});
    const hasVyak = vyakBanEmbed.fields.some(
      (user) => user.name.split(" | ")[0] === userInfo.name
    );
    if (hasVyak) {
      console.log(user + "hasVyak");
      vyakBanEmbed.fields.some((user) => {
        if (user.name.split(" | ")[0] === userInfo.name) {
          user.value = `Added:  ${moment().format()}\nTo be removed:  ${moment(
            moment()
          )
            // .add(10, "s")
            .add(10, "m")
            .format()}`;
        }
      });
      //   console.log(vyakBanEmbed.fields);
    } else {
      console.log(user + "hasntVyak");
      vyakBanEmbed.fields.push({
        name: `${userInfo.name} | ${userInfo.id}`,
        value: `Added:  ${moment().format()}\nTo be removed:  ${moment(moment())
          //   .add(10, "s")
          .add(10, "m")
          .format()}`,
      });
    }
    vyakBanEmbedMsg.edit({
      embed: {
        title: "Vyakban Users",
        fields: vyakBanEmbed.fields,
      },
    });
  } else {
    client.channels.cache
      .get(vyakbanChannelId)
      .send({
        embed: {
          title: "Vyakban Users",
          fields: [
            {
              name: `${userInfo.name} | ${userInfo.id}`,
              value: `Added:  ${moment().format()}\nTo be removed:  ${moment(
                moment()
              )
                // .add(10, "s")
                .add(10, "m")
                .format()}`,
            },
          ],
        },
      })
      .then((msg) => msg.pin());
  }
  const userToBan = message.guild.members.cache.find(
    (user) => user.id === userInfo.id
  );
  userToBan.roles.add(vyakbanRoleId);
};

const getUserInfoFromMention = (mention, client) => {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return {
      id: client.users.cache.get(mention).id,
      name: client.users.cache.get(mention).username,
    };
  }
};

const vyakBanWatcher = (client) => {
  const guild = client.guilds.cache.get(guildId);
  //   const vyakbanRole = guild.roles.cache.get(vyakbanRoleId);
  const channel = client.channels.cache.get(vyakbanChannelId);
  schedule.scheduleJob("* * * * *", async () => {
    const pinnedMessages = channel.messages.fetchPinned();
    if (
      (await pinnedMessages.then(async (collection) => collection.size)) === 0
    )
      return;
    const vyakBanEmbedMsg = await pinnedMessages.then(
      async (collection) => Array.from(collection.entries())[0][1]
    );
    const vyakBanEmbed = vyakBanEmbedMsg.embeds[0];
    for (let i = 0; i < vyakBanEmbed.fields.length; i++) {
      if (
        moment(vyakBanEmbed.fields[i].value.split("To be removed:  ")[1]).diff(
          moment()
        ) < 0
      ) {
        // del role
        // console.log(vyakBanEmbed.fields[i].name.split(" | ")[1]);
        let member = await guild.members.fetch(
          vyakBanEmbed.fields[i].name.split(" | ")[1]
        );
        console.log(member.username + member.id + " deleting role");
        member.roles.remove(vyakbanRoleId);
        vyakBanEmbed.fields = vyakBanEmbed.fields.splice(i + 1, 1);
        vyakBanEmbedMsg.edit({
          embed: {
            title: "Vyakban Users",
            fields: vyakBanEmbed.fields,
          },
        });
      }
    }
  });
};

module.exports = { setVakbyan, vyakBanWatcher };
