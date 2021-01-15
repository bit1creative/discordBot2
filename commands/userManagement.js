const { userLogChannel, guestRoleId } = require("../config.json");

function newMember(client, member){

      member.guild.channels.cache.get(userLogChannel).send(`Hi ${member.user} blabla`);
      member.roles.add(guestRoleId);

}

module.exports = { newMember }