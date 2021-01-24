const { adminManagementChannelId, adminRoleId } = require("../../config.json");

function setRole(message) {

    if ( !message.member.roles.cache.find( role => role.id === adminRoleId) ) {

        return message.delete();

    }

    if( !message.channel.id === adminManagementChannelId ) {

        message.author.send("Wrong channel. Go to your admin's user management channel.");
        return message.delete();

    }

    let user = message.mentions?.members?.first()?.user;
    let role = message.mentions?.roles?.first()?.id;


    console.log(user);



}

module.exports = { setRole }