const { errorHandler } = require("../../core/errorHandler");
const axios = require("axios");

const { giphyApi } = require("../../../config.json");

function giphy(channel, tag) {
  tag = tag.join(" ");
  const request = `https://api.giphy.com/v1/gifs/random?api_key=${giphyApi}&tag=${tag}&rating=g`;
  axios
    .get(request)
    .then((response) => {
      channel.send(response?.data?.data?.url);
    })
    .catch((e) => {
      errorHandler(channel, e);
    });
}

module.exports = { giphy };
