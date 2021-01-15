const { welcomeRoomId, guestRoleId } = require("../config.json");

function newMember(client, member){
      member.guild.channels.cache.get(welcomeRoomId).send(`Hi ${member.user} blabla`);
      member.roles.add(guestRoleId);
}

module.exports = { newMember }