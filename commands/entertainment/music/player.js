const ytdl = require("ytdl-core");
const { errorHandler } = require("../../core/errorHandler");
const axios = require("axios");
const Discord = require("discord.js");

const { ytApi } = require("../../../config.json");

const queueContruct = {
  textChannel: null,
  voiceChannel: null,
  connection: null,
  songs: [],
  volume: 1,
  playing: false,
};

async function execute(message) {
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(
      "You need to join voice channel in order to play music!"
    );
  }

  const permission = voiceChannel.permissionsFor(message.client.user);

  if (!permission.has("CONNECT") || !permission.has("SPEAK")) {
    return message.channel.send("Acess denied. Got no permissions!");
  }

  let song = await getSongInfo(message);

  if (queueContruct.songs.length == 0) {
    queueContruct.textChannel = message.channel;
    queueContruct.voiceChannel = voiceChannel;
    queueContruct.playing = true;

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(queueContruct);
    } catch (e) {
      queueContruct.textChannel = null;
      queueContruct.voiceChannel = null;
      queueContruct.playing = false;
      queueContruct.songs.splice(0, 1);
      errorHandler(message.channel, e);
      return;
    }
  } else {
    queueContruct.songs.push(song);
    const songEmbed = new Discord.MessageEmbed()
      .setColor("#e342f5")
      .setTitle("*Added to the queue...*")
      .setDescription(`[${song.title}](${song.url})`)
      .setThumbnail(song.img);
    queueContruct.textChannel.send(songEmbed);
    return;
  }
}

function play(queueContruct) {
  let song = queueContruct.songs[0];

  if (!song) {
    queueContruct.voiceChannel.leave();
    queueContruct.songs = [];
    return;
  }

  try {
    const dispatcher = queueContruct.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        queueContruct.songs.splice(0, 1);
        play(queueContruct);
      })
      .on("error", (e) => errorHandler(queueContruct.textChannel, e));

    dispatcher.setVolumeLogarithmic(1);

    const songEmbed = new Discord.MessageEmbed()
      .setColor("#e342f5")
      .setTitle("*Now playing...*")
      .setDescription(`[${song.title}](${song.url})`)
      .setThumbnail(song.img);
    queueContruct.textChannel.send(songEmbed);
  } catch (e) {
    errorHandler(queueContruct.textChannel, e);
    return;
  }
}

function skip(message) {
  if (
    !message.member.voice.channel ||
    message.member.voice.channel != queueContruct.voiceChannel
  )
    return message.channel.send(
      "You have to be in a voice channel with the bot to skip the music!"
    );

  if (!queueContruct.songs[1])
    return message.channel.send("There is no more songs in the queue.");

  try {
    queueContruct.connection.dispatcher.end();
  } catch (e) {
    errorHandler(queueContruct.textChannel, e);
    return;
  }
}

function stop(message) {
  if (
    !message.member.voice.channel ||
    message.member.voice.channel != queueContruct.voiceChannel
  )
    return message.channel.send(
      "You have to be in a voice channel with the bot to stop the music!"
    );

  if (!queueContruct.songs[0])
    return message.channel.send("There is no song that I could stop!");

  try {
    queueContruct.songs = [];
    queueContruct.connection.dispatcher.end();
  } catch (e) {
    errorHandler(queueContruct.textChannel, e);
    return;
  }
}

async function getSongInfo(message) {
  const channel = message.channel;
  const search = message.content.split(/ +/).slice(1).join("%20");

  if (search.length == 0) {
    channel.send("No search key given.");
    return;
  }

  try {
    const request = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${search}&key=${ytApi}`;
    const songInfo = await axios.get(request).then((response) => {
      return {
        title: response?.data?.items[0]?.snippet?.title,
        url: `https://www.youtube.com/watch?v=${response?.data?.items[0]?.id?.videoId}`,
        img: response?.data?.items[0]?.snippet?.thumbnails?.medium?.url,
      };
    });
    return songInfo;
  } catch (e) {
    errorHandler(channel, e);
    return;
  }
}

module.exports = { execute, skip, stop };
