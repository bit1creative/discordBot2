# discordBot2

NodeJS DiscordJS BOT with following functionality:
* pp!gif
  sends back a random gif
* pp!gif tag
  sends back a random gif based on your tag
* pp!getvid key_words
  find an YT video by your key words
* pp!play video_name / url
  play song
* pp!skip
  skip song
* pp!stop
  stop playing
* pp!weather city
  get a 5 days weather forecast for your city
* !register
  Use to register
* !random
  Use to choose a random user from registered
* !mystats
  View your stats
* !top
  Top 5 most frequently chosen users
// For admins only
* pp!setrole @mention_user @mention_role
update user's role

and autorole on joining.

config.json file:

{
  "token": "YOUR_DISCORD_BOT_API",
  "prefix": "YOUR_PREFIX",
  "giphyApi": "GIPHY_API",
  "ytApi": "YOUTUBE_API",
  "weatherApi":"WEATHER_API",
  "mongodbConnection":"mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0-wythh.mongodb.net/DB_NAME",
  "adminManagementChannelId": "CHANNEL_ID",
  "userLogChannelId": "CHANNEL_ID",
  "guestRoleId": "ROLE_ID",
  "adminRoleId": "ROLE_ID",
  "guildId":"GUILD_ID",
  "vyakbanChannelId":"CHANNEL_ID",
  "vyakbanRoleId":"ROLE_ID"
}
