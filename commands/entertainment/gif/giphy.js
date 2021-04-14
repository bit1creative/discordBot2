const { errorHandler } = require("../../core/errorHandler");
const fetch = require("node-fetch");

const { giphyApi } = require("../../../config.json");

function giphy(channel, tag) {
  tag = tag.join(" ");
  const request = `https://api.giphy.com/v1/gifs/random?api_key=${giphyApi}&tag=${tag}&rating=g`;
  fetch(request)
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => channel.send(data.data.url));
      } else {
        channel.send(
          "<@343104810326818820>\nNetwork request for products.json failed with response " +
            response.status +
            ": " +
            response.statusText
        );
      }
    })
    .catch((e) => {
      errorHandler(channel, e);
    });
}

module.exports = { giphy };
