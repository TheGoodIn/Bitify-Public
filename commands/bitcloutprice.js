const Discord = require('discord.js');
const clout = require('bitcloutprice')
const COLOR = process.env.COLOR;
module.exports = {
    name: "bitcloutprice",
    description: "announces somethin",
    aliases: ['testing', 'pfp'],
    run: async (client, message, args) => {



        const price = await clout.get()
        const embed = new Discord.MessageEmbed()
        .setTitle('BitClout Price')
        .setDescription(`${price.dollar}`)
        .setFooter('Powered by BitCloutPriceUS')
        .setColor(COLOR)

        message.channel.send(embed)


    }
}