const { error } = require("./core/error_handler");
const fetch = require("node-fetch");

const { giphy_api } = require("../config.json");

function giphy(channel, tag){
    tag = tag.join(" ");
    const request = `https://api.giphy.com/v1/gifs/random?api_key=${giphy_api}&tag=${tag}&rating=g`;
        fetch(request).then(response => {
            if(response.ok){
                response.json()
                .then(data => channel.send(data.data.url))
            } else {
                channel.send("<@343104810326818820>\nNetwork request for products.json failed with response " + response.status + ': ' + response.statusText);
            }
        }).catch(e => {
            error(channel, e)
        });
}

module.exports = {giphy}