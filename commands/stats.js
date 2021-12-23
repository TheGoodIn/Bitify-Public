const Discord = require('discord.js')
const fetch = require('node-fetch')
const admin = require('firebase-admin');

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "stats",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {

                
        var filter = (m, user) => {
            return m.author.id === message.author.id;
        };

        const verembed = new Discord.MessageEmbed()
        .setTitle('Clout.Link Stats')
        .setDescription(`Please enter your short URL ending below`)
        .setFooter('Example: If your URL is clout.link/Goodin just type Goodin below')
        .setColor(COLOR)

        const send = await message.author.send(verembed)

        var msgcollector = send.channel.createMessageCollector(filter, {
            time: 120000,
          });

          msgcollector.on("collect", async (m) => {
            msgcollector.stop();
            const info = await fetch(`https://clout.link/yourls-api.php?username=Goodin&password=Contrucci10119401$&action=url-stats&format=json&shorturl=https://clout.link/${m.content}`)

            const response = await info.json()

            if(response != null){
                if(response.statusCode == 404){
                    const err = new Discord.MessageEmbed()
                    .setTitle('404 Error.')
                    .setDescription('We couldn\'t found that URL, please make sure you just did the ending')
                    .setColor(COLOR)

                    return message.channel.send(err)
                }
                if(response.statusCode == 200){

                    const embed1 = new Discord.MessageEmbed()
                    .setTitle('URL Lookup Information')
                    .setDescription(`Short URL: ${response.link.shorturl}\n Long URL: ${response.link.url}\n Clicks: ${response.link.clicks}\n Created: ${response.link.timestamp}`)
                    .setColor(COLOR)
                    .setFooter('Bitify', client.user.avatarURL())

                    return message.channel.send(embed1)
                }
            }

          });

        

    }
}