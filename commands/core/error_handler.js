function errorHandler(channel, error){
    channel.send(`<@343104810326818820>` + 
                    `\n ` + "```" + error.name + 
                    ` : ` + error.message +
                    `\n` + error.stack.split('\n') + "```" )
    console.log(error);
}

module.exports = { errorHandler }
