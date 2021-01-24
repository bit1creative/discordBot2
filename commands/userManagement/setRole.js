const { adminManagementChannelId, adminRoleId, guestRoleId } = require("../../config.json");

function setRole(message) {

    if ( !message.member.roles.cache.find( role => role.id === adminRoleId) ) {

        return message.delete();

    }

    if( !message.channel.id === adminManagementChannelId ) {

        message.author.send("Wrong channel. Go to your admin's user management channel.");
        return message.delete();

    }

    let user = message.guild.members.cache.find( 
        user => user.id === message.mentions?.members?.first()?.user.id
        );

    let role = message.mentions?.roles?.first()?.id;

    if ( !user || !role ) {

        message.channel.send("Check for user and role to be mentioned.");

    }

    if ( user.roles.cache.find( role => role.id === guestRoleId) ) {

        user.roles.remove(guestRoleId);

    }

    user.roles.add(role);
    message.channel.send(`User <@${user.id}> has been updated with a role <@&${role}>`);

    return;

}

module.exports = { setRole }