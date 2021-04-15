const Discord = require("discord.js");
const axios = require("axios");
const { prefix, weatherApi } = require("../../../config.json");
const { errorHandler } = require("../../core/errorHandler");
const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

async function getWeatherForecast(city) {
  const data = axios
    .get(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApi}&units=metric`
    )
    .then(function (response) {
      const info = {
        city: response.data.city.name,
        country: response.data.city.country,
        data: response.data.list,
      };
      //   console.log(data);
      return info;
    });
  // .catch((err) => {
  //   return errorHandler(channel, err);
  // });
  return data;
}

function sortDataByDays(data) {
  const daysWeather = {};
  for (let i = 0; i < data.length; i++) {
    let date = new Date(data[i].dt_txt);
    let day = daysList[date.getDay()];
    daysWeather[day] = Object.keys(daysWeather).includes(day)
      ? [...daysWeather[day], data[i]]
      : [data[i]];
  }
  return daysWeather;
}

function fillEmbedWithData(embed, dayNum, wForecast) {
  const Day = Object.keys(wForecast)[dayNum];
  embed.setTitle(Day);
  embed.fields = [];
  let isInline = 0;
  for (hourForecast of wForecast[Object.keys(wForecast)[dayNum]]) {
    embed.addField(
      `${hourForecast.dt_txt.split(" ")[1].slice(0, -3)} :`,
      `**${Math.round(hourForecast.main.temp)}**‎ °C 
                        ${
                          hourForecast.weather[0].description
                            .charAt(0)
                            .toUpperCase() +
                          hourForecast.weather[0].description.slice(1)
                        }\n`,
      (inline = true)
    );
    isInline++;
    if (isInline == 2) {
      isInline = 0;
      embed.addField("\u200B", "\u200B", true);
    }
  }
  return;
}

async function sendWeatherForecastEmbed(message) {
  const CITY = message.content.replace(prefix + "weather", "");
  if (!CITY) {
    return message.channel.send(
      "Please enter the city name next to the command call."
    );
  }
  const data = await getWeatherForecast(CITY).catch((err) => {
    return errorHandler(message.channel, err, "weatherError");
  });
  if (!data) return;
  //   console.log(data);
  const daysWeather = sortDataByDays(data.data);
  //   console.log(daysWeather);
  let pages = Object.keys(daysWeather);
  let page = 1;
  const embedWeatherForecast = new Discord.MessageEmbed()
    .setColor(3447003)
    .setAuthor(
      `${data.city}, ${data.country}`,
      "https://www.thelogomix.com/files/imagecache/v3-logo-detail/Yoga-Perdana-Weather-Forecast-App-Icon.jpg"
    )
    // .setTitle(Object.keys(days_weather)[page-1])
    .setTimestamp(new Date())
    .setFooter(
      `Page ${page} of ${pages.length}`,
      "https://cdn.discordapp.com/avatars/636114764371722250/e3111998347bf140248f24dec037892a.png?size=2048"
    );
  fillEmbedWithData(embedWeatherForecast, page - 1, daysWeather);
  message.channel.send(embedWeatherForecast).then(async function (message) {
    await message.react("⏮").then(() => message.react("⏭️"));
    const filter = (reaction) => {
      return ["⏮", "⏭️"].includes(reaction.emoji.name);
    };
    const collector = message.createReactionCollector(filter, {
      time: 120000,
    });
    collector.on("collect", async (reaction, user) => {
      const userReactions = message.reactions.cache.filter((reaction) =>
        reaction.users.cache.has(user.id)
      );
      try {
        for (const reaction of userReactions.values()) {
          await reaction.users.remove(user.id);
        }
      } catch (error) {
        console.error("Failed to remove reactions.");
      }
      switch (reaction.emoji.name) {
        case "⏮":
          if (page == 1) return;
          page--;
          // fillEmbedWithData(embedWeatherForecast, page - 1, daysWeather);
          // embedWeatherForecast.setFooter(`Page ${page} of ${pages.length}`);
          // message.edit(embedWeatherForecast);
          break;
        case "⏭️":
          if (page == pages.length) return;
          page++;
          // fillEmbedWithData(embedWeatherForecast, page - 1, daysWeather);
          // embedWeatherForecast.setFooter(`Page ${page} of ${pages.length}`);
          // message.edit(embedWeatherForecast);
          break;
      }
      fillEmbedWithData(embedWeatherForecast, page - 1, daysWeather);
      embedWeatherForecast.setFooter(`Page ${page} of ${pages.length}`);
      message.edit(embedWeatherForecast);
    });
    collector.on("end", (collected) => {
      return;
    });
  });
}

module.exports = { sendWeatherForecastEmbed };
