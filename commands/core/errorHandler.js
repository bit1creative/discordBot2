function errorHandler(channel, error, errorType = null) {
  switch (errorType) {
    case "weatherError":
      channel.send(weatherErrorEmbed(error));
      break;
    default:
      channel.send(
        `<@343104810326818820>` +
          `\n ` +
          "```" +
          error.name +
          ` : ` +
          error.message +
          `\n` +
          error.stack.split("\n") +
          "```"
      );
      console.log(error);
      break;
  }
}

function weatherErrorEmbed(error) {
  return {
    embed: {
      color: 3447003,
      author: {
        name: "Weather Forecast",
        icon_url:
          "https://www.thelogomix.com/files/imagecache/v3-logo-detail/Yoga-Perdana-Weather-Forecast-App-Icon.jpg",
      },
      title: `${error}`,
      description: "Check your **City Name** for errors",
      timestamp: new Date(),
      footer: {
        icon_url:
          "https://cdn.discordapp.com/avatars/636114764371722250/e3111998347bf140248f24dec037892a.png?size=2048",
        text: "© Wheather Forecast",
      },
    },
  };
}

module.exports = { errorHandler };
