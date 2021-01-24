const { userLogChannel, guestRoleId } = require("../../config.json");

function newMember(client, member){

      member.guild.channels.cache.get(userLogChannel).send(`${member.user} joined the server.`);
      member.roles.add(guestRoleId);

}

module.exports = { newMember }