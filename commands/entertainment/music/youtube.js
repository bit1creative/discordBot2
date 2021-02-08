const { error } = require("../../core/error_handler");
const fetch = require("node-fetch");

const {yt_api} = require("../../../config.json");

function get_video(channel, search){
    search = search.join("%20")
    if(search.length == 0){
        channel.send("No search key given.")
        return;
    }
    const request = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${search}&key=${yt_api}`
    fetch(request).then(response => {
        if(response.ok){
            response.json()
            .then(data => channel.send(`https://www.youtube.com/watch?v=${data.items[0].id.videoId}`))
            // .then(data => channel.send(`https://www.youtube.com/watch?v=${data.items[0].snippet.title}`))
        } else {
            channel.send("<@343104810326818820>\nNetwork request for products.json failed with response " + response.status + ': ' + response.statusText);
        }
    }).catch(e => {
        error(channel, e)
    });
}

module.exports = {get_video}