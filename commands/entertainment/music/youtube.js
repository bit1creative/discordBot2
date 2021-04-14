const { errorHandler } = require("../../core/errorHandler");
const axios = require("axios");

const { ytApi } = require("../../../config.json");

function getVideo(channel, search) {
  search = search.join("%20");
  if (search.length == 0) {
    channel.send("No search key given.");
    return;
  }
  const request = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${search}&type=video&key=${ytApi}`;
  axios
    .get(request)
    .then((response) => {
      channel.send(
        `https://www.youtube.com/watch?v=${response.data.items[0].id.videoId}`
      );
    })
    // .then(data => channel.send(`https://www.youtube.com/watch?v=${response.data.items[0].snippet.title}`))
    .catch((e) => {
      errorHandler(channel, e);
    });
}

module.exports = { getVideo };
